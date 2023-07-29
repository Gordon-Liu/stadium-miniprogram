// 模版
const Model = require('../framework/model.js');

class TempModel extends Model {

}

// 集合名
TempModel.CL = 'db_temp';

TempModel.DB_STRUCTURE = {
	id: 'string|true',
	name: 'string|true|comment=名字',

	times: 'array|true|comment=时间段',


	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

module.exports = TempModel;