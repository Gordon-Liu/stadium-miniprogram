const Service = require('../../framework/service.js');
const TempModel = require('../../models/temp.js');

class AdminTempService extends Service {

	/**添加模板 */
	async insert({
		name,
		times,
	}) {
        const data = {
            name,
            times
        };

		return await TempModel.insert(data);
	}

	/**更新数据 */
	async edit({
		id,
		limit,
		isLimit
	}) {
        const where = {
            id
        };
        const temp = await TempModel.getOne(where);
        if (!temp) return null;
        const times = [];
        for (let k in temp.times) {
            times.push({
                ...temp.times[k],
                limit,
                isLimit
            });
        }
        const data = {
            times
        };
		return await TempModel.edit(where, data);
	}


	/**删除数据 */
	async delete(id) {
        const where = {
            id
        };
		return await TempModel.del(where)
	}


	/**分页列表 */
	async getList() {
		const orderBy = {
			'add_time': 'desc'
		};
		const fields = '*';

		const where = {};
		return await TempModel.getAll(where, fields, orderBy);
	}
}

module.exports = AdminTempService;