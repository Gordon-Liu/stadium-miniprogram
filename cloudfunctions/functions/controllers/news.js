const Controller = require('../framework/controller.js');
const NewsService = require('../services/news.js');

class NewsController extends Controller {

	/** 首页资讯列表 */
	async getHomeList() {

		const service = new NewsService();
		const list = await service.getHomeList();

		return list;
	}


	/** 资讯列表 */
	async getList() {

		// 数据校验
		const rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			cateId: 'string',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new NewsService();
		const result = await service.getList(params);

		return result;

	}


	/** 浏览资讯信息 */
	async getDetail() {
		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new NewsService();
		const news = await service.getDetail(params.id);

		return news;
	}



}

module.exports = NewsController;