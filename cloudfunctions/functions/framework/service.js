const timeUtil = require('../framework/time-util.js');
const appCode = require('../framework/app-code.js');
const AppError = require('../framework/app-error.js');

class Service {
	constructor() {
		// 当前时间戳
		this._timestamp = timeUtil.time();
	}
	/**
	 * 抛出异常
	 * @param {*} msg 
	 * @param {*} code 
	 */
	AppError(msg, code = appCode.LOGIC) {
		throw new AppError(msg, code);
	}
}

module.exports = Service;