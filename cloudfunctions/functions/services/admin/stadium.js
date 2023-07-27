const Service = require('../../framework/service.js');
const StadiumModel = require('../../models/stadium.js');
const DayModel = require('../../models/day.js');
const timeUtil = require('../../framework/time-util.js'); 

class AdminStadiumService extends Service {
    /**获取信息 */
	async getDetail(id) {
		const fields = '*';

		const where = {
			id
		};
		const stadium = await StadiumModel.getOne(where, fields);
		if (!stadium) return null;

		stadium.days_set = await this.getDaysSet(id, timeUtil.time('Y-M-D')); //今天及以后

		return stadium;
    }
    
    /** 获取日期设置 */
	async getDaysSet(meetId, startDay, endDay = null) {
		const where = {
			stadium_id: meetId
		}
		if (startDay && endDay && endDay == startDay)
			where.day = startDay;
		else if (startDay && endDay)
			where.day = ['between', startDay, endDay];
		else if (!startDay && endDay)
			where.day = ['<=', endDay];
		else if (startDay && !endDay)
			where.day = ['>=', startDay];

		const orderBy = {
			'day': 'asc'
		}
		const list = await DayModel.getAllBig(where, 'day,dayDesc,times', orderBy, 1000);

		return list;
	}
}

module.exports = AdminStadiumService;