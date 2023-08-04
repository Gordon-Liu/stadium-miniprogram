const Service = require('../../framework/service.js');
const UserModel = require('../../models/user.js');
const util = require('../../framework/util.js');

class AdminUserService extends Service {

    /** 取得用户分页列表 */
	async getList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件 
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			add_time: 'desc'
		};
		const fields = '*';


		const where = {};

		if (util.isDefined(search) && search) {
			where.or = [{
					name: ['like', search]
				},
				{
					mobile: ['like', search]
				},
				// {
				// 	memo: ['like', search]
				// },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					where.and.status = Number(sortVal);
					break;
				// case 'companyDef':
				// 	// 单位性质 
				// 	where.and.USER_COMPANY_DEF = (sortVal);
				// 	break;

				case 'sort':
					// 排序
					if (sortVal == 'newdesc') { //最新
						orderBy = {
							'add_time': 'desc'
						};
					}
					if (sortVal == 'newasc') {
						orderBy = {
							'add_time': 'asc'
						};
					}
			}
		}
		const result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal, false);


		// 为导出增加一个参数condition
		result.condition = encodeURIComponent(JSON.stringify(where));

		return result;
	}
}

module.exports = AdminUserService;