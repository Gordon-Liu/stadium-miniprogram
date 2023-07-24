const Model = require('../framework/model.js');
class UserModel extends Model {}

// 集合名
UserModel.CL = 'db_user';

UserModel.DB_STRUCTURE = {
	id: 'string|true',

	mini_openid: 'string|true|comment=小程序openid',
	status: 'int|true|default=1|comment=状态 0=待审核,1=正常',

	name: 'string|false|comment=用户姓名',
	mobile: 'string|false|comment=联系电话',

	work: 'string|false|comment=所在单位',
	city: 'string|false|comment=所在城市',
	trade: 'string|false|comment=职业领域',


	login_cnt: 'int|true|default=0|comment=登陆次数',
	login_time: 'int|false|comment=最近登录时间',


	add_time: 'int|true',
	add_ip: 'string|false',
	edit_time: 'int|true',
	edit_ip: 'string|false',
}

/**
 * 状态 0=待审核,1=正常 
 */
UserModel.STATUS = {
	UNUSE: 0,
	COMM: 1
};

UserModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常'
};


module.exports = UserModel;