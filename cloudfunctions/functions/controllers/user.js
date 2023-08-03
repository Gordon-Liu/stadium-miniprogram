const Controller = require('../framework/controller.js');
const UserService = require('../services/user.js');
const contentCheck = require('../framework/content-check.js');

class UserController extends Controller {

    /** 登录 */
	async login() {

		const service = new UserService();
		const user = await service.login(this._openId);

		return user;
    }

    /** 获得用户详情 */
    async getDetail() {
        const service = new UserService();
		const user = await service.getDetail(this._token);

		return user;
    }

    /** 修改用户资料 */
	async edit() {
		// 数据校验
		let rules = {
			name: 'must|string|min:1|max:20',
			mobile: 'must|mobile|name=手机',
			city: 'string|max:100|name=所在城市',
			work: 'string|max:100|name=所在单位',
			trade: 'string|max:100|name=行业领域',
		};

		// 取得数据
		const params = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(params);

		const service = new UserService();
		return await service.edit(this._userId, params);
	}

    /** 获取手机号码 */
	async getPhone() {

		// 数据校验
		const rules = {
			cloudID: 'must|string|min:1|max:200|name=cloudID',
		};

		// 取得数据
		const params = this.validateData(rules);


		const service = new UserService();
		return await service.getPhone(params.cloudID);
	}
}

module.exports = UserController;