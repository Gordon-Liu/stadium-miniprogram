const Service = require('../../framework/service.js');
const LogModel = require('../../models/log.js');

class AdminLogService extends Service {
    /** 写入日志 */
	async insertLog(content, admin, type) {
		if (!admin) return;

		const data = {
			content: content,

			admin_id: admin.id,
			admin_name: admin.name,  
			type: type
		}
		await LogModel.insert(data);
	}
}

module.exports = AdminLogService;