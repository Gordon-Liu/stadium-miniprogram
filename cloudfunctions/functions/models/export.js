const Model = require('../framework/model.js');

class ExportModel extends Model {

}

// 集合名
ExportModel.CL = 'db_export';

ExportModel.DB_STRUCTURE = {
	id: 'string|true',
	key: 'string|true',
	cloud_id: 'string|true|comment=cloudID',

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

module.exports = ExportModel;