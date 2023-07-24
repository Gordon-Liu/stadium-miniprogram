const timeUtil = require('../framework/time-util.js');

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