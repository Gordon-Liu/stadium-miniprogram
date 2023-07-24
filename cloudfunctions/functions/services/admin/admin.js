const Service = require('../../framework/service.js');
const AdminModel = require('../../models/admin.js');

class AdminService extends Service {
    /** 是否管理员 */
	async isAdmin(token) {

		const where = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: ['>', timeUtil.time() - config.ADMIN_LOGIN_EXPIRE * 1000], // token有效时间
			status: 1,
		}
		const admin = await AdminModel.getOne(where, 'ADMIN_ID,ADMIN_PHONE,ADMIN_NAME,ADMIN_TYPE');
		if (!admin)
			this.AppError('管理员不存在', appCode.ADMIN_ERROR);

		return admin;
	}
}

module.exports = AdminService;