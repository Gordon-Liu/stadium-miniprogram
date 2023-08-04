const AdminController = require('../../framework/admin-controller.js');
const AdminUserService = require('../../services/admin/user.js');
const timeUtil = require('../../framework/time-util.js');
const dataUtil = require('../../framework/data-util.js');
const UserModel = require('../../models/user.js');

class AdminUserController extends AdminController {

    /** 用户列表 */
	async getList() {
		await this.isAdmin();

		// 数据校验
		const rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminUserService();
		const result = await service.getList(params);

		// 数据格式化
		const list = result.list;
		for (let k in list) {
			list[k].status_desc = UserModel.getDesc('status', list[k].status);
			list[k].add_time = timeUtil.timestamp2Time(list[k].add_time);
			list[k].login_time = list[k].login_time ? timeUtil.timestamp2Time(list[k].login_time) : '未登录';

		}
		result.list = list;
		return result;
	} 
    
}

module.exports = AdminUserController;