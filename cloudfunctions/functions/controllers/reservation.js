const Controller = require('../framework/controller.js');
const ReservationService = require('../services/reservation.js');
const ReservationModel = require('../models/reservation.js');
const timeUtil = require('../framework/time-util.js');

class ReservationController extends Controller {

    /** 我的预约列表 */
	async getMyList() {
        // 数据校验
		const rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new ReservationService();
		const result = await service.getMyList(this._userId, params);

		return result;
    }
    
    /** 我的某日预约列表 */
	async getMySomeday() {
		// 数据校验
		const rules = {
			day: 'must|date|name=日期',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new ReservationService();
		const list = await service.getMySomeday(this._userId, params.day);

		return list;

    }

    /** 我的预约详情 */
    async getMyDetail() {
		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new ReservationService();
		const reservation = await service.getMyDetail(this._userId, params.id);
		if (reservation) {
			reservation.status_desc = ReservationModel.getDesc('STATUS', reservation.status);
			reservation.add_time = timeUtil.timestamp2Time(reservation.add_time);
		}
		return reservation;

	}
    
}

module.exports = ReservationController;