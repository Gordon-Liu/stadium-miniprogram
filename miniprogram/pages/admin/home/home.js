// pages/admin/home/home.js
import { ApiCode } from '../../../apis/cloud';
import AdminHomeApi from '../../../apis/admin/home'
import AdminToken from '../../../utils/admin-token';
import { showConfirm, loginExpirationConfirm } from '../../../utils/confirm';
import { timestamp2Time } from '../../../utils/time';

Component({
    data: {
        isLoad: false,
        isAdmin: false,
        admin: null,
        last: '',
        stadiumCnt: 0,
        reservationCnt: 0,
        userCnt: 0,
        newsCnt: 0,
    },
    methods: {
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        bindExit() {
            AdminToken.clear();
            showConfirm('您确认退出?', () => {
                wx.switchTab({
                    url: '/pages/my/my',
                });
            });
        },
        async getData () {
            
            const res = await AdminHomeApi.home();
            if (res.code === ApiCode.SUCCESS) {
                this.setData({
                    stadiumCnt: res.data.stadiumCnt,
                    reservationCnt: res.data.reservationCnt,
                    userCnt: res.data.userCnt,
                    newsCnt: res.data.newsCnt,
                });
            }
        },
        async onPullDownRefresh () {
            await this.getData();
            wx.stopPullDownRefresh();
        },
    },
    lifetimes: {
        attached() {
            const admin = AdminToken.getAdmin();
            if (!admin) {
                loginExpirationConfirm();
            } else {
                this.setData({
                    isLoad: true,
                    isAdmin: true,
                    admin,
                    last: admin.login_time ? timestamp2Time(admin.login_time) : '尚未登录'
                });
                this.getData();
            }
        }
    }
});