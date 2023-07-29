const AdminController = require('../../framework/admin-controller.js');
const AdminTempService = require('../../services/admin/temp.js');
const LogModel = require('../../models/log.js');

class AdminTempController extends AdminController {
    
    /** 创建模板 */
    async insert() {
        await this.isAdmin();

        const rules = {
            name: 'must|string|min:1|max:20|name=名称',
            times: 'must|array|name=模板时段',
        };

        // 取得数据
        const params = this.validateData(rules);

        const service = new AdminTempService();
        const result = await service.insert(params);

        return result;

    }

    /** 模板列表 */
	async getList() {
		await this.isAdmin();

		const service = new AdminTempService();
		const result = await service.getList();

		return result;
    }
    
    /** 删除模板 */
	async delete() {
		await this.isAdmin();

		// 数据校验
		const rules = {
			id: 'must|id',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminTempService();
		await service.delete(params.id);

    }
    
    /** 编辑模板 */
	async edit() {
		await this.isAdmin();

		const rules = {
			id: 'must|id',
			isLimit: 'must|bool|name=是否限制',
			limit: 'must|int|name=人数上限',
		};

		// 取得数据
		const params = this.validateData(rules);

		const service = new AdminTempService();
		const result = service.edit(params);

		return result;
	}
}

module.exports = AdminTempController;