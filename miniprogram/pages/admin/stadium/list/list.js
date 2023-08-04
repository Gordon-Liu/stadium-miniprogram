// pages/admin/stadium/list/list.js
import AdminToken from '../../../../utils/admin-token';
import behavior from '../../../../cmpts/behavior/list';
import { loginExpirationConfirm } from '../../../../utils/confirm';
import { dataset } from '../../../../utils/util';

Component({
    behaviors: [behavior],
    data: {
        isAdmin: false,
        sortMenus: [],
        sortMenus: [],
    },
    methods: {
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        async bindRecordSelect (e) {
            const itemList = ['预约名单', '导出名单Excel文件', '管理员核销预约码', '用户自助签到码'];
            const stadiumId = dataset(e, 'id');
            const title = encodeURIComponent(dataset(e, 'title'));
    
            wx.showActionSheet({
                itemList,
                success: async res => {
                    switch (res.tapIndex) {
                        case 0: { //预约名单 
                            wx.navigateTo({
                                url: '/pages/admin/stadium/record/record?stadiumId=' + stadiumId + '&title=' + title,
                            });
                            break;
                        }
                        case 1: { //导出 
                            wx.navigateTo({
                                url: '../export/admin_join_export?meetId=' + meetId + '&title=' + title,
                            });
                            break;
                        }
                        case 2: { //核验 
                            this.bindScanTap(e);
                            break;
                        }
                        case 3: { //自助签到码 
                            pageHelper.showModal('请进入「预约名单->名单」， 查看某一时段的「用户自助签到码」')
                            break;
                        }
                    }
    
    
                },
                fail: function (res) {}
            })
        },
        getSearchMenu() {
            this.setData({
                sortItems: [],
                sortMenus: [{
                    label: '全部',
                    type: '',
                    value: ''
                }, {
                    label: '使用中',
                    type: 'status',
                    value: 1
                }, {
                    label: '已停止',
                    type: 'status',
                    value: 9
                }, {
                    label: '已关闭',
                    type: 'status',
                    value: 10
                }, {
                    label: '羽毛球场预约',
                    type: 'typeId',
                    value: 1
                }, {
                    label: '足球场预约',
                    type: 'typeId',
                    value: 2
                }, {
                    label: '篮球场预约',
                    type: 'typeId',
                    value: 3
                }, {
                    label: '乒乓球预约',
                    type: 'typeId',
                    value: 4
                }, {
                    label: '网球场预约',
                    type: 'typeId',
                    value: 5
                }, {
                    label: '游泳馆预约',
                    type: 'typeId',
                    value: 6
                }, {
                    label: '健身房预约',
                    type: 'typeId',
                    value: 7
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