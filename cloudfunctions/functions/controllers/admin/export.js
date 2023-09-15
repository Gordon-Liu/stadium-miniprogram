const AdminController = require('../../framework/admin-controller.js');
const AdminExportService = require('../../services/admin/export.js');

class AdminExportController extends AdminController {

    /** 当前是否有导出文件生成 */
	async userDataGet() {
		await this.isAdmin();

		// 数据校验
		const rules = {
			isDel: 'int|must', //是否删除已有记录
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminExportService();

		if (params.isDel === 1)
			await service.deleteUserDataExcel(); //先删除 
	
		return await service.getUserDataURL();
    }
    
    /** 导出数据 */
    async userDataExport() {
        await this.isAdmin();

        // 数据校验
		const rules = {
			condition: 'string|name=导出条件',
        };
        
        // 取得数据
		const params = this.validateData(rules);

		const service = new AdminExportService();
		return await service.exportUserDataExcel(params.condition);
    }
}

module.exports = AdminExportController;