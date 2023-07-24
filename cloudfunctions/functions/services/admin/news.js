const Service = require('../../framework/service.js');
const util = require('../../framework/util.js');
const NewsModel = require('../../models/news.js');

class AdminNewsService extends Service {

    /** 获取名称 */
	async getName(id) {
		const news = await NewsModel.getOne(id, 'title');
        return news.title;
	}
}

module.exports = AdminNewsService;