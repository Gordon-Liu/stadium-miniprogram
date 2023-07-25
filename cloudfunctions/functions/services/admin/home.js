const Service = require('../../framework/service.js');
const AdminModel = require('../../models/admin.js');
const UserModel = require('../../models/user.js');
const StadiumModel = require('../../models/stadium.js');
const NewsModel = require('../../models/news.js');
const ReservationCnt = require('../../models/reservation.js');
const timeUtil = require('../../framework/time-util.js');
const dataUtil = require('../../framework/data-util.js');

class AdminHomeService extends Service {
    
    async login(name, password) {
        // 判断是否存在
		const where = {
            name,
            password,
			status: 1
		}
		const fields = 'id,phone,name,type,login_time,login_cnt';
		const admin = await AdminModel.getOne(where, fields);
		if (!admin)
            this.AppError('管理员不存在');

        const cnt = admin.login_cnt;

        // 生成token
        const token = dataUtil.genRandomString(32);
        const data = {
            token: token,
            token_time: timeUtil.time(),
            login_time: timeUtil.time(),
            login_cnt: cnt + 1
        }
        await AdminModel.edit(where, data);

		return {
            ...admin,
            token: data.token,
            token_time: data.token_time,
		};
    }

    /**
	 * 首页数据归集
	 */
	async home() {
		const userCnt = await UserModel.count({});
		const stadiumCnt = await StadiumModel.count({});
		const newsCnt = await NewsModel.count({});
		const reservationCnt = await ReservationCnt.count({});
		return {
			userCnt,
			stadiumCnt,
			newsCnt,
			reservationCnt
		}
	}
}

module.exports = AdminHomeService;