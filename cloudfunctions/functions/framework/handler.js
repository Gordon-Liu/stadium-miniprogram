const appCode = require('./app-code.js');

function handlerBasic(code, msg = '', data = {}) {
	switch (code) {
		case appCode.SUCCESS:
			msg = (msg) ? msg + ':ok' : 'ok';
			break;
		case appCode.SERVER:
			msg = '服务器繁忙，请稍后再试';
			break;
		case appCode.LOGIC:
			break;
		case appCode.DATA:
			break;

			/*
			default:
				msg = '服务器开小差了，请稍后再试';
				break;*/
	}
	return {
		code: code,
		msg: msg,
		data: data
	}

}

function handleServerError(msg = '') {
	return handlerBasic(appCode.SERVER, msg);
}

function handlerSuccess(msg = '') {
	return handlerBasic(appCode.SUCCESS, msg);
}

function handlerAppError(msg = '', code = appCode.LOGIC) {
	return handlerBasic(code, msg);
}

function handlerData(data, msg = '') {
	return handlerBasic(appCode.SUCCESS, msg, data);
}

module.exports = {
	handlerBasic,
	handlerData,
	handlerSuccess,
	handleServerError,
	handlerAppError
}