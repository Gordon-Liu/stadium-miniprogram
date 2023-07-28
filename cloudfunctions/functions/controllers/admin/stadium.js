const AdminController = require('../../framework/admin-controller.js');
const AdminStadiumService = require('../../services/admin/stadium.js');
const cacheUtil = require('../../framework/cache.js');
const timeUtil = require('../../framework/time-util.js');
const LogModel = require('../../models/log.js');

class AdminStadiumController extends AdminController {

    /** 预约列表 */
	async getList() {

		await this.isAdmin();

		// 数据校验
		const rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminStadiumService();
		const result = await service.getList(params);

		// 数据格式化
		let list = result.list;
		for (let k in list) {

			list[k].add_time = timeUtil.timestamp2Time(list[k].add_time);
			list[k].edit_time = timeUtil.timestamp2Time(list[k].edit_time);
			list[k].leaveDay = this._getLeaveDay(list[k].days);

		}
		result.list = list;

		return result;


    }
    
    /** 获取预约信息用于编辑修改 */
	async getDetail() {
		await this.isAdmin();

		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminStadiumService();
		const detail = await service.getDetail(params.id);
		return detail;
    }


    
    /** 发布 */
	async insert() {
		await this.isAdmin();

		const rules = {
			title: 'must|string|min:2|max:50|name=标题',
			typeId: 'must|id|name=分类',
			typeName: 'must|string|name=分类',
			order: 'must|int|min:1|max:9999|name=排序号',
			daysSet: 'must|array|name=预约时间设置', 
			isShowLimit: 'must|int|in:0,1|name=是否显示可预约人数', 

            formSet: 'must|array|name=用户资料设置',
            content: 'must|array|name=详细介绍',
            styleSet: 'must|object|name=样式设置',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminStadiumService();
		const result = await service.insert(this._adminId, params);

		// 清空缓存
		cacheUtil.clear();

		this.log('创建了新预约《' + params.title + '》', LogModel.TYPE.STADIUM);

		return result;

    }
    
    /** 编辑预约 */
	async edit() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=标题',
			typeId: 'must|id|name=分类',
			typeName: 'must|string|name=分类',
			order: 'must|int|min:1|max:9999|name=排序号',
			daysSet: 'must|array|name=预约时间设置',
		 
			isShowLimit: 'must|int|in:0,1|name=是否显示可预约人数', 

            formSet: 'must|array|name=用户资料设置',
            content: 'must|array|name=详细介绍',
            styleSet: 'must|object|name=样式设置',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminStadiumService();
		const result = service.edit(params);

		// 清空缓存
		cacheUtil.clear();

		this.log('修改了预约《' + params.title + '》内容', LogModel.TYPE.STADIUM);

		return result;
    }
    
    // 计算可约天数
	_getLeaveDay(days) {
		let now = timeUtil.time('Y-M-D');
		let count = 0;
		for (let k in days) {
			if (days[k] >= now) count++;
		}
		return count;
	}
}


module.exports = AdminStadiumController;