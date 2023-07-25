const Model = require('../framework/model.js');

class LogModel extends Model {

}

// 集合名
LogModel.CL = 'db_log';

LogModel.DB_STRUCTURE = {
	id: 'string|true',

	admin_id: 'string|true|comment=管理员',
	admin_phone: 'string|false',
	admin_name: 'string|true',

	content: 'string|true',

	type: 'int|true|comment=日志类型 ',

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

LogModel.TYPE = {
	USER: 0,
	STADIUM: 1,
	NEWS: 2,
	SYSTEM: 99
}
LogModel.TYPE_DESC = {
	USER: '用户',
	STADIUM: '预约/活动',
	NEWS: '内容/文章',
	SYSTEM: '系统'
}

module.exports = LogModel;