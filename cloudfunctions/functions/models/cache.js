const Model = require('../framework/model.js');

class CacheModel extends Model {

}

// 集合名
CacheModel.CL = 'db_cache';

CacheModel.DB_STRUCTURE = {
	id: 'string|true',

	key: 'string|true',
	value: 'object|true',

	timeout: 'int|true|comment=超时时间，毫秒',

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

module.exports = CacheModel;