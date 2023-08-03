
const Service = require('../framework/service.js');
const UserModel = require('../models/user.js');
const cloud = require('wx-server-sdk');
const config = require('../config.js');

cloud.init({
    env: config.CLOUD_ID
});

class UserService extends Service {

	async login(openId) {

		const fields = '*';

		const where = {
			mini_openid: openId,
		}
		let user = await UserModel.getOne(where, fields);
		if (!user) {
            const data = {
                mini_openid: openId,
            }
            await UserModel.insert(data);
            user = await UserModel.getOne(where, fields);
        };

		return user;
    }
    
    async getDetail(userId) {
        const fields = '*';

		const where = {
			id: userId,
        }
        
        const user = await UserModel.getOne(where, fields);

        if (!user) return null;

        return user;
    }

    async edit(userId, {
		mobile,
		name,
		trade,
		work,
		city
	}) {
        const where = {
			id: userId
		};

		const data = {
			mobile: mobile,
			name: name,
			city: city,
			work: work,
			trade: trade
		};

		await UserModel.edit(where, data);
    }

    /** 获取手机号码 */
	async getPhone(cloudID) {
		const res = await cloud.getOpenData({
			list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});
		if (res && res.list && res.list[0] && res.list[0].data) {
			const phone = res.list[0].data.phoneNumber;
			return phone;
		} else {
            return '';
        }
	}
}

module.exports = UserService;