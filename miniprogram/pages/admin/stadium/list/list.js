// pages/admin/stadium/list/list.js
import AdminToken from '../../../../utils/admin-token';
import behavior from '../../../../cmpts/behavior/list';
import { loginExpirationConfirm } from '../../../../utils/confirm';

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