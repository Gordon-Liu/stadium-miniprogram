 // 无提示成功，同时做后续处理, 最多可显示两行
 export function showNoneToast(title = '操作完成', duration = 1500, callback) {
    return wx.showToast({
        title: title,
        icon: 'none',
        duration: duration,
        mask: true,
        success: function () {
            callback && (setTimeout(() => {
                callback();
            }, duration));
        }
    });
}

// 无提示成功，返回 
export function showNoneToastReturn(title = '操作完成', duration = 2000) {
    let callback = function () {
        wx.navigateBack({
            delta: 0,
        })
    }
    return showNoneToast(title, duration, callback);
}

// 错误提示成功，同时做后续处理, 最多显示7个汉字长度
export function showErrorToast(title = '操作失败', duration = 1500, callback) {
    return wx.showToast({
        title: title,
        icon: 'error',
        duration: duration,
        mask: true,
        success: function () {
            callback && (setTimeout(() => {
                callback();
            }, duration));
        }
    });
}

// 加载中，同时做后续处理, 最多显示7个汉字长度
export function showLoadingToast(title = '加载中', duration = 1500, callback) {
    return wx.showToast({
        title: title,
        icon: 'loading',
        duration: duration,
        mask: true,
        success: function () {
            callback && (setTimeout(() => {
                callback();
            }, duration));
        }
    });
}

// 提示成功，同时做后续处理, 最多显示7个汉字长度
export function showSuccessToast(title = '操作成功', duration = 1500, callback) {
    return wx.showToast({
        title: title,
        icon: 'success',
        duration: duration,
        mask: true,
        success: function () {
            callback && (setTimeout(() => {
                callback();
            }, duration));
        }
    });
}