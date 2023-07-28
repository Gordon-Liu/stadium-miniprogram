const Service = require('../../framework/service.js');
const StadiumModel = require('../../models/stadium.js');
const DayModel = require('../../models/day.js');
const timeUtil = require('../../framework/time-util.js'); 
const util = require('../../framework/util');

class AdminStadiumService extends Service {
    /**预约项目分页列表 */
	async getList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
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
		if (util.isDefined(search) && search) {
			where.title = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					where.status = Number(sortVal);
					break;
				case 'typeId':
					// 按类型
					where.type_id = sortVal;
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'view_cnt': 'desc',
							'add_time': 'desc'
						};
					}

					break;
			}
		}

		return await StadiumModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
    }
    
    /**获取信息 */
	async getDetail(id) {
		const fields = '*';

		const where = {
			id
		};
		const stadium = await StadiumModel.getOne(where, fields);
		if (!stadium) return null;

		stadium.days_set = await this.getDaysSet(id, timeUtil.time('Y-M-D')); //今天及以后

		return stadium;
    }

    /**添加 */
	async insert(adminId, {
		title,
		order,
		typeId,
		typeName,
		daysSet,
		isShowLimit,
        formSet,
        content,
        styleSet,
	}) {
        const data = {
            title,
            order,
            type_id: typeId,
            type_name: typeName,
            is_show_limit: isShowLimit,
            form_set: formSet,
            content,
            style_set: styleSet,
            admin_id: adminId
        };
        const id = await StadiumModel.insert(data);
        if (daysSet) {
            const dataArray = [];
            for (let k in daysSet) {
                dataArray.push({
                    stadium_id: id,
                    day: daysSet[k].day,
                    day_desc: daysSet[k].dayDesc,
                    times: daysSet[k].times,
                });
            }
            await DayModel.insertBatch(dataArray);
        }
        
		return id
	}

    /**更新数据 */
	async edit({
		id,
		title,
		typeId,
		typeName,
		order,
		daysSet,
		isShowLimit,
        formSet,
        content,
        styleSet,
	}) {
        const where = {
            id
        };
        const data = {
            title,
            order,
            type_id: typeId,
            type_name: typeName,
            is_show_limit: isShowLimit,
            form_set: formSet,
            content,
            style_set: styleSet,
        };
		return await StadiumModel.edit(where, data);

	}
    
    /** 获取日期设置 */
	async getDaysSet(meetId, startDay, endDay = null) {
		const where = {
			stadium_id: meetId
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
		const list = await DayModel.getAllBig(where, 'day,dayDesc,times', orderBy, 1000);

		return list;
	}
}

module.exports = AdminStadiumService;