const Service = require('../../framework/service.js');
const AdminModel = require('../../models/admin.js');
const timeUtil = require('../../framework/time-util.js');
const appCode = require('../../framework/app-code.js');
const config = require('../../config.js');

class AdminService extends Service {
    /** 是否管理员 */
	async isAdmin(token) {

		const where = {
			token: token,
			token_time: ['>', timeUtil.time() - config.ADMIN_LOGIN_EXPIRE * 1000], // token有效时间
			status: 1,
		}
		const admin = await AdminModel.getOne(where, 'phone,name,type');
		if (!admin)
			this.AppError('管理员不存在', appCode.ADMIN_ERROR);

		return admin;
    }
}

module.exports = AdminService;