import { CLOUD_ID } from '../settings/setting';
import Token from '../utils/token';
import AdminToken from '../utils/admin-token';
import { isDefined } from '../utils/util';
import { genRandomNum } from '../utils/data';

export const ApiCode = {
    SUCCESS: 200,
    SERVER: 500, //服务器错误  
    LOGIC: 1600, //逻辑错误 
    DATA: 1301, // 数据校验错误 
    HEADER: 1302, // header 校验错误  

    ADMIN_ERROR: 2401 //管理员错误
};

export class Client {

    _token() {
        const user = Token.getUser();
        return user && user.id ? user.id : '';
    }

    request(route, params = {}) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'functions',
                // 传递给云函数的参数
                config: {
                    env: CLOUD_ID
                },
                data: {
                    route,
                    token: this._token(),
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
                        console.log(res)
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

    async uploadImage(imgList, dir, sign) {

        for (let i = 0; i < imgList.length; i++) {
   
            let filePath = imgList[i];
            let ext = filePath.match(/\.[^.]+?$/)[0];
   
            // 是否为临时文件
            if (filePath.includes('tmp') || filePath.includes('temp') || filePath.includes('wxfile')) {
                let rd = genRandomNum(100000, 999999);
                await wx.cloud.uploadFile({
                    cloudPath: sign ? dir + sign + '/' + rd + ext : dir + rd + ext,
                    filePath: filePath, // 文件路径
                }).then(res => {
                    imgList[i] = res.fileID;
                }).catch(error => {
                    // handle error TODO:剔除图片
                    console.error(error);
                })
            }
        }
   
        return imgList;
    }

    /**
     * 数据列表请求
     * @param {*} that 
     * @param {*} listName 
     * @param {*} route 
     * @param {*} params 
     * @param {*} options 
     * @param {*} isReverse  是否倒序
     */
    async dataList(dataList, route, params, callback, isReverse = false) {

        console.log('dataList begin');

        if (!isDefined(dataList) || !dataList) {
            // let data = {};
            dataList = {
                page: 1,
                size: 20,
                list: [],
                count: 0,
                total: 0,
                oldTotal: 0
            };
            // that.setData(data);
            callback && callback(dataList);
        }

        //改为后台默认控制
        //if (!helper.isDefined(params.size))
        //	params.size = 20;

        if (!isDefined(params.isTotal))
            params.isTotal = true;

        let page = params.page;
        let count = dataList.count;
        if (page > 1 && page > count) {
            wx.showToast({
                duration: 500,
                icon: 'none',
                title: '没有更多数据了',
            });
            return;
        }

        // 删除未赋值的属性
        for (let k in params) {
            if (!isDefined(params[k]))
                delete params[k];
        }

        // 记录当前老的总数
        let oldTotal = 0;
        if (dataList && dataList.total)
            oldTotal = dataList.total;
        params.oldTotal = oldTotal;

        // 云函数调用 
        await this.request(route, params).then(function (res) {
            console.log('cloud begin');

            // 数据合并
            let newDataList = res.data;
            let tList = dataList.list;

            if (newDataList.page == 1) {
                tList = res.data.list;
            } else if (newDataList.page > dataList.page) { //大于当前页才能更新
                if (isReverse)
                    tList = res.data.list.concat(tList);
                else
                    tList = tList.concat(res.data.list);
            } else
                return;

            newDataList.list = tList;
            callback && callback(newDataList);
            // that.setData(listData);

            console.log('cloud END');
        }).catch(err => {
            console.log(err)
        });

        console.log('dataList END');
    }
}

export class AdminClient extends Client {
    _token() {
        const admin = AdminToken.getAdmin();
 		return admin && admin.token ? admin.token : '';
    }
}