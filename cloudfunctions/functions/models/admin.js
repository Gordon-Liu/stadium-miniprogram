const Model = require('../framework/model.js');

class AdminModel extends Model {

}

// 集合名
AdminModel.CL = 'db_admin';

AdminModel.DB_STRUCTURE = {
	id: 'string|true',
	name: 'string|true',
	phone: 'string|true|comment=登录电话',
	status: 'int|true|default=1|comment=状态：0=禁用 1=启用',

	login_cnt: 'int|true|default=0|comment=登录次数',
	login_time: 'int|true|default=0|comment=最后登录时间',
	type: 'int|true|default=0|comment=类型 0=普通管理员 1=超级管理员',

	token: 'string|false|comment=当前登录token',
	token_time: 'int|true|default=0|comment=当前登录token time',

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

module.exports = AdminModel;