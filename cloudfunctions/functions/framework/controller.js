const util = require('./util.js');
const dataCheck = require('./data-check.js');
class Controller {
    constructor(route, openId, event) {
        this._route = route; // 路由
        this._openId = openId; //用户身份
        this._event = event; // 所有参数   
        this._params = event.params; //数据参数
    
        this._token = event.token || '';
        
        this._userId = event.token || '';
    }

    /**
	 * 数据校验
	 * @param {*} rules 
	 */
	validateData(rules = {}) {
		const params = this._params;
		return dataCheck.check(params, rules);
	}

	// 取得某个具体的参数值
	getParameter(name) {
		const params = this._params;
		if (util.isDefined(params))
			return params[name];
		else
			return '';
	}

}
module.exports = Controller;