const AdminController = require('../../framework/admin-controller.js');
const AdminReservationService = require('../../services/admin/reservation.js');
const timeUtil = require('../../framework/time-util.js');
const dataUtil = require('../../framework/data-util.js');

class AdminReservationController extends AdminController {

    /** 预约名单列表 */
	async getList() {
		await this.isAdmin();

		// 数据校验
		const rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			stadiumId: 'must|id',
			mark: 'must|string',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminReservationService();
		const result = await service.getList(params);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].edit_time = timeUtil.timestamp2Time(list[k].edit_time);

			//分解成数组，高亮显示
			const forms = list[k].forms;
			for (let j in forms) {
				forms[j].valArr = dataUtil.splitTextByKey(forms[j].val, params.search);
			}

		}
		result.list = list;

		return result;

	}
    
}

module.exports = AdminReservationController;