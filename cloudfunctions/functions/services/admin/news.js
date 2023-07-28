const Service = require('../../framework/service.js');
const util = require('../../framework/util.js');
const NewsModel = require('../../models/news.js');

class AdminNewsService extends Service {

    /**添加资讯 */
	async insert(adminId, {
		title,
		cateId, //分类
		cateName,
		order,
		type = 0, //类型 
		desc = '',
        url = '', //外部链接
        pic = [],
        content = [],
	}) {
        const data = {
            title,
            cate_id: cateId,
            cate_name: cateName,
            order,
            type,
            desc,
            url,
            pic,
            content,
            admin_id: adminId
        };

        return await NewsModel.insert(data);
	}

    /** 获取名称 */
	async getName(id) {
		const news = await NewsModel.getOne(id, 'title');
        return news.title;
    }
    
    /**取得资讯分页列表 */
	async getList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'order': 'asc',
			'add_time': 'desc'
		};
		const fields = '*';

		const where = {};

		if (util.isDefined(search) && search) {
			where['or'] = [{
				title: ['like', search]
			}, ];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId':
					// 按类型
					where['cate_id'] = sortVal;
					break;
				case 'status':
					// 按类型
					where['status'] = Number(sortVal);
					break;
				case 'home':
					// 按类型
					where['home'] = Number(sortVal);
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'view_cnt ': 'desc',
							'add_time': 'desc'
						};
					}
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
    

}

module.exports = AdminNewsService;