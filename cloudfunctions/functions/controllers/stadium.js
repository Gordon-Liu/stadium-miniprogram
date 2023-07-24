const Controller = require('../framework/controller.js');
const StadiumService = require('../services/stadium.js');

class StadiumController extends Controller {

    /** 首页场馆动态列表 */
	async getHomeList() {
        const service = new StadiumService();
		const list = await service.getHomeList();
		return list
	}
}

module.exports = StadiumController;