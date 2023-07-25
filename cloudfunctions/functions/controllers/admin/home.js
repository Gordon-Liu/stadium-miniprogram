const AdminController = require('../../framework/admin-controller.js');
const AdminHomeService = require('../../services/admin/home.js');
const LogModel = require('../../models/log.js');

class AdminHomeController extends AdminController {
    // 管理员登录  
	async login() {

		// 数据校验
		const rules = {
			name: 'required|string|min:5|max:30|name=管理员名',
			password: 'required|string|min:5|max:30|name=密码',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminHomeService();
        const admin = await service.login(params.name, params.password);

		// 写日志
		this.log('登录了系统', admin, LogModel.TYPE.SYSTEM);

		return admin;
    }
    
    // 管理首页 
	async home() {
        await this.isAdmin();
        
		const service = new AdminHomeService();
		return await service.home();
	}
}

module.exports = AdminHomeController;