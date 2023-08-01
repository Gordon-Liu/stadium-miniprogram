const Model = require('../framework/model.js');

class SetupModel extends Model {

}

// 集合名
SetupModel.CL = 'db_setup';

SetupModel.DB_STRUCTURE = {
	id: 'string|true',

	name: 'string|false', 

	about: 'string|false|comment=关于我们',
	about_pic: 'array|false|default=[]|comment=关于我们的图片cloudId',

	service_pic: 'array|false|default=[]|comment=客服图片cloudId',
	office_pic: 'array|false|default=[]|comment=官微图片cloudId',

	address: 'string|false|comment=地址',
	phone: 'string|false|comment=电话', 

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

module.exports = SetupModel;