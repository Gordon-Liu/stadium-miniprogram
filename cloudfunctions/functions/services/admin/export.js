const Service = require('../../framework/service.js');
const DataService = require('../data.js');

// 导出用户数据KEY
const EXPORT_USER_DATA_KEY = 'export_user_data';

class AdminExportService extends Service {
    
    /**获取用户数据 */
	async getUserDataURL() {
		const dataService = new DataService();
		return await dataService.getExportDataURL(EXPORT_USER_DATA_KEY);
	}

	/**删除用户数据 */
	async deleteUserDataExcel() {
		const dataService = new DataService();
		return await dataService.deleteDataExcel(EXPORT_USER_DATA_KEY);
    }
    
    /**导出用户数据 */
	async exportUserDataExcel(condition) {
        const dataService = new DataService();
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

}

module.exports = AdminExportService;