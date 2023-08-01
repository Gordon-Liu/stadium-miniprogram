const Service = require('../framework/service.js');
const StadiumModel = require('../models/stadium.js');
const DayModel = require('../models/day');
const ReservationModel = require('../models/reservation');
const util = require('../framework/util.js');
const timeUtil = require('../framework/time-util.js');
const dataUtil = require('../framework/data-util.js');
const config = require('../config.js');
const LogUtil = require('../framework/log-util.js');

class StadiumService extends Service {

    constructor() {
		super();
		this._log = new LogUtil(config.STADIUM_LOG_LEVEL);
	}

    AppError(msg) {
		this._log.error(msg);
		super.AppError(msg);
    }
    
    _stadiumLog(stadium, func = '', msg = '') {
		let str = '';
		str = `[STADIUM=${stadium.title}][${func}] ${msg}`;
		this._log.debug(str);
	}

    /** 取得预约分页列表 */
	async getList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		typeId, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'order': 'asc',
			'add_time': 'desc'
		};
		const fields = '*';

		const where = {};
		if (typeId && typeId !== '0') where.type_id = typeId;

		where.status = ['in', [StadiumModel.STATUS.COMM, StadiumModel.STATUS.OVER]]; // 状态  

		if (util.isDefined(search) && search) {
			where.title = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'view_cnt': 'desc',
							'add_time': 'desc'
						};
					}
					if (sortVal == 'new') {
						orderBy = {
							'add_time': 'desc'
						};
					}

					break;
			}
        }
       
		const result = await StadiumModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
    }
    
    /**  预约详情 */
	async getDetail(id) {

		const fields = '*';

		const where = {
			id,
			status: ['in', [StadiumModel.STATUS.COMM, StadiumModel.STATUS.OVER]]
		}
		const stadium = await StadiumModel.getOne(where, fields);
		if (!stadium) return null;


		const getDaysSet = [];
		const daysSet = await this.getDaysSet(id, timeUtil.time('Y-M-D')); //今天及以后
        stadium.days_set = daysSet;
		const now = timeUtil.time('Y-M-D');
		for (let k in daysSet) {
			const dayNode = daysSet[k];

			if (dayNode.day < now) continue; // 排除过期

			const getTimes = [];

			for (let j in dayNode.times) {
				const timeNode = dayNode.times[j];

				// 排除状态关闭的时段
				if (timeNode.status != 1) continue;

				// 判断数量是否已满
				if (timeNode.isLimit && timeNode.stat.succCnt >= timeNode.limit)
					timeNode.error = '预约已满';

				// 截止规则
				if (!timeNode.error) {
					try {
						await this.checkStadiumEndSet(stadium, timeNode.mark);
					} catch (ex) {
						if (ex.name == 'AppError')
							timeNode.error = '预约结束';
						else
							throw ex;
					}
				}

				getTimes.push(timeNode);
			}
			dayNode.times = getTimes;

			getDaysSet.push(dayNode);
		}

        stadium.days_set = getDaysSet;

		return stadium;
    }
    
    /** 获取日期设置 */
	async getDaysSet(stadiumId, startDay, endDay = null) {
		const where = {
			stadium_id: stadiumId
		}
		if (startDay && endDay && endDay == startDay)
			where.day = startDay;
		else if (startDay && endDay)
			where.day = ['between', startDay, endDay];
		else if (!startDay && endDay)
			where.day = ['<=', endDay];
		else if (startDay && !endDay)
			where.day = ['>=', startDay];

		const orderBy = {
			'day': 'asc'
		}
		const list = await DayModel.getAllBig(where, '*', orderBy, 1000);

		return list;
    }
    
    // 预约截止设置校验
	async checkStadiumEndSet(stadium, timeMark) {
		if (!stadium) this.AppError('预约截止规则错误, 预约项目不存在');

		this._stadiumLog(stadium, `------------------------------`);
		const daySet = this.getDaySetByTimeMark(stadium, timeMark); // 当天设置
		const timeSet = this.getTimeSetByTimeMark(stadium, timeMark); // 预约时段设置

		this._stadiumLog(stadium, `#预约截止规则,预约日期=<${daySet.day}>`, `预约时段=[${timeSet.start}-${timeSet.end}]`);

		const nowTime = timeUtil.time('Y-M-D h:m:s');

		const startTime = daySet.day + ' ' + timeSet.start + ':00';
		this._stadiumLog(stadium, `预约开始规则,mode=<时段过期判定>`, `预约开始时段=${startTime},当前时段=${nowTime}`);
		if (nowTime > startTime) {
			this.AppError('该时段已开始，无法预约，请选择其他');
		}

    }
    
    // 根据时段标识获取其所在天设置
	getDaySetByTimeMark(stadium, timeMark) {
		const day = this.getDayByTimeMark(timeMark);

		for (let k in stadium.days_set) {
			if (stadium.days_set[k].day == day)
				return dataUtil.deepClone(stadium.days_set[k]);
		}
		return null;
    }
    
    // 根据时段标识获取其所在天 
	getDayByTimeMark(timeMark) {
		return timeMark.substr(1, 4) + '-' + timeMark.substr(5, 2) + '-' + timeMark.substr(7, 2);
    }
    
    // 根据时段标识获取其所在时段设置
	getTimeSetByTimeMark(stadium, timeMark) {
		const day = this.getDayByTimeMark(timeMark);

		for (let k in stadium.days_set) {
			if (stadium.days_set[k].day != day) continue;

			for (let j in stadium.days_set[k].times) {
				if (stadium.days_set[k].times[j].mark == timeMark)
					return dataUtil.deepClone(stadium.days_set[k].times[j]);
			}
		}
		return null;
    }
    
    // 预约前检测
	async beforeReservation(userId, id, timeMark) {
		await this.checkStadiumRules(userId, id, timeMark);
    }
    
    /** 报名规则校验 */
	async checkStadiumRules(userId, id, timeMark) {
		// 预约时段是否存在
		const stadiumWhere = {
			id
		};
		const day = this.getDayByTimeMark(timeMark);
		const stadium = await this.getStadiumOneDay(id, day, stadiumWhere);
		if (!stadium) {
			this.AppError('预约时段选择错误，请重新选择');
		}

		// 预约时段人数和状态控制校验
		await this.checkStadiumTimeControll(stadium, timeMark);

		// 截止规则
		await this.checkStadiumEndSet(stadium, timeMark);

		// 针对用户的次数限制
		await this.checkStadiumLimitSet(userId, stadium, timeMark);

    }
    
    /** 统一获取Stadium（某天) */
	async getStadiumOneDay(id, day, where, fields = '*') {

		const stadium = await StadiumModel.getOne(where, fields);
		if (!stadium) return null;

		stadium.days_set = await this.getDaysSet(id, day, day);
		return stadium;
    }
    
    // 预约时段人数和状态控制校验
	async checkStadiumTimeControll(stadium, timeMark) {
		if (!stadium) this.AppError('预约时段设置错误, 预约项目不存在');

		const daySet = this.getDaySetByTimeMark(stadium, timeMark); // 当天设置
		const timeSet = this.getTimeSetByTimeMark(stadium, timeMark); // 预约时段设置

		if (!daySet || !timeSet) this.AppError('预约时段设置错误day&time');

		const statusDesc = timeSet.status == 1 ? '开启' : '关闭';
		let limitDesc = '';
		if (timeSet.isLimit) {
			limitDesc = '人数上限MAX=' + timeSet.limit;
		} else
			limitDesc = '人数不限制NO';

		this._stadiumLog(stadium, `------------------------------`);
		this._stadiumLog(stadium, `#预约时段控制,预约日期=<${daySet.day}>`, `预约时段=[${timeSet.start}-${timeSet.end}],状态=${statusDesc}, ${limitDesc} 当前预约成功人数=${timeSet.stat.succCnt}`);

		if (timeSet.status == 0) this.AppError('该时段预约已经关闭，请选择其他');

		// 时段总人数限制
		if (timeSet.isLimit) {
			if (timeSet.stat.succCnt >= timeSet.limit) {
				this.AppError('该时段预约人员已满，请选择其他');
			}
		}
    }
    
    // 预约次数限制校验
	async checkStadiumLimitSet(userId, stadium, timeMark) {
		if (!stadium) this.AppError('预约次数规则错误, 预约项目不存在');
		const stadiumId = stadium.id;

		const daySet = this.getDaySetByTimeMark(stadium, timeMark); // 当天设置
		const timeSet = this.getTimeSetByTimeMark(stadium, timeMark); // 预约时段设置

		this._stadiumLog(stadium, `------------------------------`);
		this._stadiumLog(stadium, `#预约次数规则,预约日期=<${daySet.day}>`, `预约时段=[${timeSet.start}～${timeSet.end}]`);

		const where = {
			stadium_id: stadiumId,
			time_mark: timeMark,
			user_id: userId,
			status: ReservationModel.STATUS.SUCCESS
		}
		const cnt = await ReservationModel.count(where);
		this._stadiumLog(stadium, `预约次数规则,mode=本时段可预约1次`, `当前已预约=${cnt}次`);
		if (cnt >= 1) {
			this.AppError(`您本时段已经预约，无须重复预约`);
		}
	}

    /**  预约前获取关键信息 */
	async getDetailForReservation(userId, id, timeMark) {

		const fields = '*';

		const where = {
			id,
			status: ['in', [StadiumModel.STATUS.COMM, StadiumModel.STATUS.OVER]]
		}
		const day = this.getDayByTimeMark(timeMark);
		const stadium = await this.getStadiumOneDay(id, day, where, fields);
		if (!stadium) return null;

		const dayDesc = timeUtil.fmtDateCHN(this.getDaySetByTimeMark(stadium, timeMark).day);

		const timeSet = this.getTimeSetByTimeMark(stadium, timeMark);
		const timeDesc = timeSet.start + '～' + timeSet.end;
		stadium.dayDesc = dayDesc + ' ' + timeDesc;

		// 取出本人最近一次本时段填写表单
		let whereReservation = {
			user_id: userId,
			stadium_id: id,
			stadium_time_mark: timeMark
		}
		let orderByReservation = {
			add_time: 'desc'
		}
		let reservation = await ReservationModel.getOne(whereReservation, 'forms', orderByReservation);

		// 取出本人最近一次本项目填写表单
		if (!reservation) {
			whereReservation = {
				user_id: userId,
				stadium_id: id,
            }
            orderByReservation = {
                add_time: 'desc'
            }
			reservation = await ReservationModel.getOne(whereReservation, 'forms', orderByReservation);
		}

		// 取出本人最近一次的填写表单
		if (!reservation) {
			whereReservation = {
				user_id: userId,
			}
			orderByReservation = {
				add_time: 'desc'
			}
			reservation = await ReservationModel.getOne(whereReservation, 'forms', orderByReservation);
		}

		const forms = reservation ? reservation.forms : [];
		stadium.forms = forms;

		return stadium;
	}

}

module.exports = StadiumService;