export const ApiCode = {
    SUCCESS: 200,
    SERVER: 500, //服务器错误  
    LOGIC: 1600, //逻辑错误 
    DATA: 1301, // 数据校验错误 
    HEADER: 1302, // header 校验错误  

    ADMIN_ERROR: 2401 //管理员错误
};

export class Client {
    request(route, params = {}) {
        return new Promise(function (resolve, reject) {
            wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'functions',
                // 传递给云函数的参数
                config: {
                    env: 'dev-6gf41ovl6f869985'
                },
                data: {
                    route,
                    token: '',
                    params
                },
                success: res => {
                    if (res.result.code == ApiCode.LOGIC || res.result.code == ApiCode.DATA) {
                        // 逻辑错误&数据校验错误 
                        wx.showModal({
                            title: '温馨提示',
                            content: res.result.msg,
                            showCancel: false
                        });
                        reject(res.result);
                        return;
                    } else if (res.result.code == ApiCode.ADMIN_ERROR) {
                        // 后台登录错误
                        wx.reLaunch({
                            url: '/pages/admin/index/login/admin_login',
                        });
                        return;
                    } else if (res.result.code != ApiCode.SUCCESS) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '系统开小差了，请稍后重试',
                            showCancel: false
                        });
                        reject(res.result);
                        return;
                    }
                    resolve(res.result);
                },
                fail: err => {
                    if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('Environment not found')) {
                        wx.showModal({
                            title: '',
                            content: '未找到云环境ID，请按手册检查前端配置文件setting.js的配置项【CLOUD_ID】或咨询作者微信cclinux0730',
                            showCancel: false
                        });
                    } else if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('FunctionName')) {
                        wx.showModal({
                            title: '',
                            content: '云函数未创建或者未上传，请参考手册或咨询作者微信cclinux0730',
                            showCancel: false
                        });
                    } else if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.   includes('performed in the current function state')) {
                        wx.showModal({
                            title: '',
                            content: '云函数正在上传中或者上传有误，请稍候',
                            showCancel: false
                        });
                    } else {
                        wx.showModal({
                            title: '',
                            content: '网络故障，请稍后重试',
                            showCancel: false
                        });
                    }
                    reject(err.result);
                },
                complete: () => {
                // ...
                }
            });
        });
    }
}