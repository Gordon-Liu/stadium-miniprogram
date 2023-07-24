const Model = require('../framework/model.js');

class NewsModel extends Model {

}

// 集合名
NewsModel.CL = 'db_news';

NewsModel.DB_STRUCTURE = {
	id: 'string|true',
	admin_id: 'string|true',

	type: 'int|true|default=0|comment=类型 0=本地文章，1=外部链接',
	title: 'string|false|comment=标题',
	desc: 'string|false|comment=描述',
	url: 'string|false|comment=外部链接URL',
	status: 'int|true|default=1|comment=状态 0/1',

	cate_id: 'string|true|comment=分类编号',
	cate_name: 'string|true|comment=分类冗余',

	order: 'int|true|default=9999',

	home: 'int|true|default=9999|comment=推荐到首页',

	content: 'array|true|default=[]|comment=内容',

	view_cnt: 'int|true|default=0|comment=访问次数',
	fav_cnt: 'int|true|default=0|comment=收藏人数',
	comment_cnt: 'int|true|default=0|comment=评论数',
	like_cnt: 'int|true|default=0|comment=点赞数',


	pic: 'array|false|default=[]|comment=附加图片  [cloudId1,cloudId2,cloudId3...]',

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

/**
 * 状态 0=未启用,1=使用中
 */
NewsModel.STATUS = {
	DISABLED: 0,
	ENABLED: 1,
};

NewsModel.STATUS_DESC = {
	DISABLED: '停用',
	ENABLED: '启用',
};

module.exports = NewsModel;