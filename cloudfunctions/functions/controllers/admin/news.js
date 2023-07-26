const AdminController = require('../../framework/admin-controller');
const AdminNewsService = require('../../services/admin/news.js');
const contentCheck = require('../../framework/content-check.js');
const LogModel = require('../../models/log.js');

class AdminNewsController extends AdminController {

    /** 资讯排序 */
	async sort() { // 数据校验
		await this.isAdmin();

		const rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminNewsService();
		await service.sort(params.id, params.sort);
	}

	/** 资讯状态修改 */
	async status() {
		await this.isAdmin();

		// 数据校验
		const rules = {
			id: 'must|id',
			status: 'must|int|in:0,1,8',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminNewsService();
		await service.status(params.id, params.status);

	}

	/** 资讯列表 */
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
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminNewsService();
		const result = await service.getList(params);

		return result;

	}

	/**
	 * 更新富文本信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateContent() {
		// await this.isAdmin();

		// 数据校验
		const rules = {
			newsId: 'must|id',
			content: 'array'
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminNewsService();
		return await service.updateContent(params);
	}


	/** 发布资讯信息 */
	async insert() {
		await this.isAdmin();

        // 数据校验
        const type = this.getParameter('type');
        const rules = type == 0 ? {
            title: 'must|string|min:4|max:50|name=标题',
            cateId: 'must|id|name=分类',
            cateName: 'must|string|name=分类',
            order: 'must|int|min:1|max:9999|name=排序号',
            desc: 'must|string|min:10|max:200|name=简介',
            type: 'must|int|in:0,1|name=是否外部文章',
            pic: 'must|array|name=附加图片',
            content: 'must|array|name=内容',
        } : {
            title: 'must|string|min:4|max:50|name=标题',
            cateId: 'must|id|name=分类',
            cateName: 'must|string|name=分类',
            order: 'must|int|min:1|max:9999|name=排序号',
            desc: 'must|string|min:10|max:200|name=简介',
            type: 'must|int|in:0,1|name=是否外部文章',
            url: 'must|string|min:10|max:300|name=外部链接地址',
            pic: 'must|array|name=附加图片',
            content: 'must|array|name=内容',
        };

		// 取得数据
		const params = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(params);

		const service = new AdminNewsService();
		const result = await service.insert(this._adminId, params);

		this.log('添加了文章《' + params.title + '》', LogModel.TYPE.NEWS);

		return result;

	}


	/** 获取资讯信息用于编辑修改 */
	async getDetail() {
		// await this.isAdmin();

		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(params);

		const service = new AdminNewsService();
		return await service.getDetail(params.id);

	}

	/** 编辑资讯 */
	async edit() {
		// await this.isAdmin();

        // 数据校验
        const type = this.getParameter('type');
        const rules = type == 0 ? {
            id: 'must|id',
            title: 'must|string|min:4|max:50|name=标题',
            cateId: 'must|id|name=分类',
            cateName: 'must|string|name=分类',
            order: 'must|int|min:1|max:9999|name=排序号',
            desc: 'string|min:10|max:200|name=简介',
            type: 'must|int|in:0,1|name=是否外部文章'
        } : {
            id: 'must|id',
            title: 'must|string|min:4|max:50|name=标题',
            cateId: 'must|id|name=分类',
            cateName: 'must|string|name=分类',
            order: 'must|int|min:1|max:9999|name=排序号',
            desc: 'string|min:10|max:200|name=简介',
            type: 'must|int|in:0,1|name=是否外部文章',
            url: 'must|string|min:10|max:300|name=外部链接地址',
        };

		// 取得数据
		const params = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(params);

		const service = new AdminNewsService();
		const result = service.edit(params);

		this.log('修改了文章《' + params.title + '》', LogModel.TYPE.NEWS);

		return result;
	}

	/** 删除资讯 */
	async del() {
		// await this.isAdmin();

		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);
        const service = new AdminNewsService();

		const name = await adminNewsService.getName(params.id);

		await service.del(params.id);

		this.log('删除了文章《' + name + '》', LogModel.TYPE.NEWS);

	}

	/**
	 * 更新图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updatePic() {
		// await this.isAdmin();

		// 数据校验
		const rules = {
			newsId: 'must|id',
			imgList: 'array'
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminNewsService();
		return await service.updatePic(params);
	}
}

module.exports = AdminNewsController;