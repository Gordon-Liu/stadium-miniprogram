const AdminController = require('../../framework/admin-controller');

class AdminStadiumController extends AdminController {
    /** 获取预约信息用于编辑修改 */
	async getDetail() {
		await this.isAdmin();

		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminStadiumService();
		const detail = await service.getDetail(params.id);
		return detail;
	}
}


module.exports = AdminStadiumController;