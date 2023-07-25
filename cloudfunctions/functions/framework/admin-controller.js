const Controller = require('./controller.js');
const timeUtil = require('./time-util.js');
const AdminService = require('../services/admin/admin.js');
const AdminLogService = require('../services/admin/log.js');

class AdminController extends Controller {

	constructor(route, openId, event) {
		super(route, openId, event);

		// 当前时间戳
		this._timestamp = timeUtil.time();

		this._admin = null;
		this._adminId = '0';

	}

	/** 是否管理员  */
	async isAdmin() {
		// 判断是否管理员
		const service = new AdminService();
		const admin = await service.isAdmin(this._token);
		this._admin = admin;
		this._adminId = admin._id;
	}

	// /** 是否超级管理员  */
	// async isSuperAdmin() {
	// 	// 判断是否管理员
	// 	const service = new BaseAdminService();
	// 	const admin = await service.isSuperAdmin(this._token);
	// 	this._admin = admin;
	// 	this._adminId = admin.id;
	// }

	/** 记录日志 */
	async log(content, type) {
		const service = new AdminLogService();
		await service.insertLog(content, this._admin, type);
	}

}

module.exports = AdminController;