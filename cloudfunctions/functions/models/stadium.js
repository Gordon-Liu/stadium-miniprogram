// 场馆
const Model = require('../framework/model.js');

class StadiumModel extends Model {

}

// 集合名
StadiumModel.CL = 'db_stadium';

StadiumModel.DB_STRUCTURE = {
	id: 'string|true',
	admin_id: 'string|true|comment=添加的管理员',
	title: 'string|true|comment=标题',

	content: 'array|true|default=[]|comment=详细介绍',
	/* img=cloudID, text=文本
	[{type:'text/img',val:''}]
	*/

	// DAYS_SET: //**** 映射到day表
	days: 'array|true|default=[]|comment=最近一次修改保存的可用日期',
  
	type_id: 'string|true|comment=分类编号',
	type_name: 'string|true|comment=分类冗余', 

	is_show_limit: 'int|true|default=1|comment=是否显示可预约人数',

	style_set: 'object|true|default={}|comment=样式设置',
	/*{ 
		desc: 'string|false|comment=简介',
		pic:' string|false|default=[]|comment=封面图cloudId]'
	}
	*/

	form_set: 'array|true|default=[]|comment=表单字段设置',

	status: 'int|true|default=1|comment=状态 0=未启用,1=使用中,9=停止预约,10=已关闭',
	order: 'int|true|default=9999',

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

/**
 * 状态 0=未启用,1=使用中,9=停止预约,10=已关闭 
 */
StadiumModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
	OVER: 9,
	CLOSE: 10
};

StadiumModel.STATUS_DESC = {
	UNUSE: '未启用',
	COMM: '使用中',
	OVER: '停止预约(可见)',
	CLOSE: '已关闭(不可见)'
};

module.exports = StadiumModel;
