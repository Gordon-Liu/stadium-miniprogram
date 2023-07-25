 // 二次确认操作 
 export function showConfirm(title = '确定要删除吗？', yes, no) {
    return wx.showModal({
        title: '',
        content: title,
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
            if (res.confirm) {
                yes && yes();
            } else if (res.cancel) {
                no && no();
            }
        }
    })
}

export function showModal(content, title = '温馨提示', callback = null, confirmText = null) {
    return wx.showModal({
        title,
        content: content,
        confirmText: confirmText || '确定',
        showCancel: false,
        success(res) {
            callback && callback();
        }
    });
}

export function loginExpirationConfirm() {
    wx.showModal({
        title: '',
        content: '登录已过期，请重新登录',
        showCancel: false,
        confirmText: '确定',
        success: res => {
            wx.reLaunch({
                url: '/pages/admin/login/login',
            });
        }
    });
}