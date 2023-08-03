const Service = require('../framework/service.js');
const ReservationModel = require('../models/reservation.js');
const timeUtil = require('../framework/time-util.js');
const util = require('../framework/util.js');

class ReservationService extends Service {

    /** 取得我的预约分页列表 */
    async getMyList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
        orderBy = orderBy || {
			'add_time': 'desc'
		};
		const fields = '*';

		const where = {
			'user_id': userId
		};

		if (util.isDefined(search) && search) {
			where['stadium_title'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType) {
			// 搜索菜单
			switch (sortType) {
				case 'timedesc': { //按时间倒序
					orderBy = {
						'stadium_day': 'desc',
						'stadium_time_start': 'desc',
						'add_time': 'desc'
					};
					break;
				}
				case 'timeasc': { //按时间正序
					orderBy = {
						'stadium_day': 'asc',
						'stadium_time_start': 'asc',
						'add_time': 'asc'
					};
					break;
				}
				case 'today': { //今天
					where['stadium_day'] = timeUtil.time('Y-M-D');
					break;
				}
				case 'tomorrow': { //明日
					where['stadium_day'] = timeUtil.time('Y-M-D', 86400);
					break;
				}
				case 'success': { //预约成功
					where['status'] = ReservationModel.STATUS.SUCCESS;
					break;
				}
				case 'cancel': { //已取消
					where['status'] = ['in', [ReservationModel.STATUS.CANCEL, ReservationModel.STATUS.ADMIN_CANCEL]];
					break;
				}
			}
		}
		const result = await ReservationModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
		return result;
    }

    /** 取得我的某日预约列表 */
	async getMySomeday(userId, day) {

		const fields = '*';

        const where = {
            'user_id': userId,
            'stadium_day': day
        };

        const orderBy = {
            'stadium_time_start': 'asc',
            'add_time': 'desc'
        };

		return await ReservationModel.getAll(where, fields, orderBy);
    }
}

module.exports = ReservationService;