const Service = require('../../framework/service.js');
const ReservationModel = require('../../models/reservation.js');
const util = require('../../framework/util.js');

class AdminReservationService extends Service {

    /**预约名单分页列表 */
	async getList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		stadiumId,
		mark,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'edit_time': 'desc'
		};
		const fields = '*';

		const where = {
			stadium_id: stadiumId,
			stadium_time_mark: mark
		};
		if (util.isDefined(search) && search) {
			where['forms.val'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					sortVal = Number(sortVal);
					if (sortVal == 1099) //取消的2种
						where.status = ['in', [10, 99]]
					else
						where.status = Number(sortVal);
					break;
				case 'checkin':
					// 签到
					where.status = ReservationModel.STATUS.SUCCESS;
					if (sortVal == 1) {
						where.is_checkin = 1;
					} else {
						where.is_checkin = 0;
					}
					break;
			}
		}

		return await ReservationModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
}

module.exports = AdminReservationService;