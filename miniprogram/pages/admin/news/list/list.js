// pages/admin/news/list/list.js
import AdminToken from '../../../../utils/admin-token';
import listBehavior from '../../../../cmpts/behavior/list';
import { loginExpirationConfirm } from '../../../../utils/confirm';

Component({
    behaviors: [listBehavior],
    data: {
        isAdmin: false,
    },
    methods: {
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        bindSortTap: async function (e) {
            if (!AdminBiz.isAdmin(this)) return;
    
            let id = e.currentTarget.dataset.id;
            let sort = e.currentTarget.dataset.sort;
            if (!id || !sort) return;
    
            let params = {
                id,
                sort
            }
    
            try {
                await cloudHelper.callCloudSumbit('admin/news_sort', params).then(res => {
                    pageHelper.modifyListNode(id, this.data.dataList.list, 'NEWS_HOME', sort);
                    this.setData({
                        dataList: this.data.dataList
                    });
                });
            } catch (e) {
                console.log(e);
            }
        },
    
        _del: async function (id, that) {
            if (!AdminBiz.isAdmin(this)) return;
            if (!id) return;
    
            let params = {
                id
            }
    
            let callback = async () => {
                try {
                    let opts = {
                        title: '删除中'
                    }
                    await cloudHelper.callCloudSumbit('admin/news_del', params, opts).then(res => {
                        pageHelper.delListNode(id, that.data.dataList.list, '_id');
                        that.data.dataList.total--;
                        that.setData({
                            dataList: that.data.dataList
                        });
                        pageHelper.showSuccToast('删除成功');
                    });
                } catch (e) {
                    console.log(e);
                }
            }
            pageHelper.showConfirm('确认删除？删除不可恢复', callback);
    
        },
    
        bindReviewTap: function (e) {
            let id = pageHelper.dataset(e, 'id');
            wx.navigateTo({
                url: pageHelper.fmtURLByPID('/pages/news/detail/news_detail?id=' + id),
            });
        },
    
        bindStatusSelectTap: async function (e) {
            if (!AdminBiz.isAdmin(this)) return;
            let itemList = ['启用', '停用', '删除'];
            let id = pageHelper.dataset(e, 'id');
            wx.showActionSheet({
                itemList,
                success: async res => {
                    switch (res.tapIndex) {
                        case 0: { //启用
                            await this._setStatus(id, 1, this);
                            break;
                        }
                        case 1: { //停止 
                            await this._setStatus(id, 0, this);
                            break;
                        }
                        case 2: { //删除
                            await this._del(id, this);
                            break;
                        }
    
                    }
    
    
                },
                fail: function (res) {}
            })
        },
    
    
        _setStatus: async function (id, status, that) {
            status = Number(status);
            let params = {
                id,
                status
            }
    
            try {
                await cloudHelper.callCloudSumbit('admin/news_status', params).then(res => {
                    pageHelper.modifyListNode(id, that.data.dataList.list, 'NEWS_STATUS', status, '_id');
                    that.setData({
                        dataList: that.data.dataList
                    });
                    pageHelper.showSuccToast('设置成功');
                });
            } catch (e) {
                console.log(e);
            }
        },
    
        getSearchMenu() {
            this.setData({
                sortItems: [],
                sortMenus: [{
                    label: '全部',
                    type: '',
                    value: ''
                }, {
                    label: '正常',
                    type: 'status',
                    value: 1
                }, {
                    label: '停用',
                    type: 'status',
                    value: 0
                }, {
                    label: '首页推荐',
                    type: 'home',
                    value: 0
                }, {
                    label: '场馆动态',
                    type: 'cateId',
                    value: 1
                }, {
                    label: '运动常识',
                    type: 'cateId',
                    value: 2
                }]
            });
        }
    },
    lifetimes: {
        attached() {
            const admin = AdminToken.getAdmin();
            if (!admin) {
                loginExpirationConfirm();
            } else {
                this.setData({
                    isAdmin: true,
                });
                this.getSearchMenu();
            }
        }
    }
});