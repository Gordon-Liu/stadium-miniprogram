const Service = require('../framework/service.js');
const StadiumModel = require('../models/stadium.js');

class StadiumService extends Service {
    /** 取得首页列表 */
    async getHomeList() {
        const orderBy = {
            'home': 'asc',
            'order': 'asc',
            'add_time': 'desc'
        };
        const fields = '*';
        const where = {
            status: 1 // 状态    
        };
        return await StadiumModel.getAll(where, fields, orderBy, 10);
    }
}

module.exports = StadiumService;