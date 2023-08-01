const Controller = require('../framework/controller.js');
const StadiumService = require('../services/stadium.js');
const timeUtil = require('../framework/time-util.js');

class StadiumController extends Controller {

    /** 预约列表 */
	async getList() {

		// 数据校验
		const rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			typeId: 'string',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new StadiumService();
		const result = await service.getList(params);

		// 数据格式化
		for (let k in result.list) {
            result.list[k].desc = result.list[k].style_set.desc;
            result.list[k].pic = result.list[k].style_set.pic;
			result.list[k].add_time = this._getLeaveDay(result.list[k].days) + '天可预约';
		}

		return result;

    }

    /** 浏览预约信息 */
	async getDetail() {
		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new StadiumService();
		const stadium = await service.getDetail(params.id);

		if (stadium) {
			// 显示转换  
		}

		return stadium;
    }
    
    /** 预约前检测 */
	async beforeReservation() {
		// 数据校验
		const rules = {
			id: 'must|id',
			timeMark: 'must|string',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new StadiumService();
		return await service.beforeReservation(this._userId, params.id, params.timeMark);
    }
    
    /**  预约前获取关键信息 */
	async getDetailForReservation() {
		// 数据校验
		const rules = {
			id: 'must|id',
			timeMark: 'must|string',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new StadiumService();
		const stadium = await service.getDetailForReservation(this._userId, params.id, params.timeMark);

		if (stadium) {
			// 显示转换  
		}

		return stadium;
	}
    
    // 计算可约天数
	_getLeaveDay(days) {
		let now = timeUtil.time('Y-M-D');
		let count = 0;
		for (let k in days) {
			if (days[k] >= now) count++;
		}
		return count;
	}
}

module.exports = StadiumController;