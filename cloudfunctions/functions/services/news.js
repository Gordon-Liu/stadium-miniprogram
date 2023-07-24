const Service = require('../framework/service.js');
const util = require('../framework/util.js');
const NewsModel = require('../models/news.js');

class NewsService extends Service {

	/** 浏览资讯信息 */
	async getDetail(id) {

		const fields = '*';

		const where = {
			id: id,
			status: NewsModel.STATUS.ENABLED
		}
		const news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		return news;
	}


	/** 取得分页列表 */
	async getList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		cateId, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'order': 'asc',
			'add_time': 'desc'
		};
		const fields = 'pic,view_cnt,title,desc,cate_id,add_time,order,status,cate_name';

		const where = {};
		where['status'] = NewsModel.STATUS.ENABLED; // 状态 

		if (cateId && cateId !== '0') where['cate_id'] = cateId;

		if (util.isDefined(search) && search) {
			where['title'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort':
					// 排序 
					if (sortVal == 'new') {
						orderBy = {
							'add_time': 'desc'
						};
					}
					break;
			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}


	/** 取得首页列表 */
	async getHomeList() {
		const orderBy = {
			'home': 'asc',
			'order': 'asc',
			'add_time': 'desc'
		};
		const fields = 'pic,title,desc,add_time';

		const where = {};
		where['status'] = NewsModel.STATUS.ENABLED; // 状态 

		return await NewsModel.getAll(where, fields, orderBy, 10);
	}


}

module.exports = NewsService;