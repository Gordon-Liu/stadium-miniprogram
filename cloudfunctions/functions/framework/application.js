const cloud = require('wx-server-sdk');
const handler = require('./handler.js');
const routes = require('./route.js');
const util = require('./util.js');
const config = require('../config.js');

cloud.init({
    env: config.CLOUD_ID
});

async function application(event, context) {
	// 取得openid
	const wxContext = cloud.getWXContext();
	try {
		if (!util.isDefined(event.route)) {
			return handler.handleServerError();
		}
		const route = event.route.toLowerCase();
		// 路由不存在
		if (!util.isDefined(routes[route])) {
			return handler.handleServerError();
		}
		const [controllerName, actionName] = routes[route].split('@');
		const openId = wxContext.OPENID;

		// 引入逻辑controller 
		const ControllerClass = require('../controllers/' + controllerName + '.js');
		const controller = new ControllerClass(route, openId, event);

        // 调用方法    
		const result = await controller[actionName]();

		// 返回值处理
		if (!result) {
            return handler.handlerSuccess(); // 无数据返回
        } else {
            return handler.handlerData(result); // 有数据返回
        }
	} catch (error) {
		const log = cloud.logger();
		if (error.name == 'AppError') {
			log.warn({
				route: event.route,
				errCode: error.code,
				errMsg: error.message
			});
			// 自定义error处理
			return handler.handlerAppError(error.message, error.code);
		} else {
			log.error({
				route: event.route,
				errCode: error.code,
				errMsg: error.message,
				errStack: error.stack
			});
			// 系统error
			return handler.handleServerError();
		}
	}
}

module.exports = application;