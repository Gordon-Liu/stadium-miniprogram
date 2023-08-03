// pages/my/my.js
import { ApiCode } from '../../../apis/cloud';
import ReservationApi from '../../../apis/reservation';
import { time } from '../../../utils/time';
import { clear } from '../../../utils/cache';
import { showNoneToast } from '../../../utils/toast';
import Token from '../../../utils/token';
import UserApi from '../../../apis/user';

Component({
    data: {
        user: null,
        myTodayList: null
    },
    methods: {
        bindJumpUrl(e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        bindSetting() {
            const itemList = ['清除缓存', '后台管理'];
			wx.showActionSheet({
				itemList,
				success: async res => {
					if (res.tapIndex == 0) {
						clear();
						showNoneToast('清除缓存成功');
					}

					if (res.tapIndex == 1) {
						wx.reLaunch({
                            url: '/pages/admin/login/login',
                        });
					}
				},
				fail: function (res) {}
			})
        },
        async getDetail() {
            const res = await UserApi.getDetail();
            if (res.code === ApiCode.SUCCESS) {
                this.setData({
                    user: res.data
                });
            }
        },
        async getMyTodayList() {
            const res = await ReservationApi.getMySomeday(time('Y-M-D'));
            if (res.code === ApiCode.SUCCESS) {
                this.setData({
                    myTodayList: res.data
                });
            }
        }
    },
    lifetimes: {
        attached() {
            if (!Token.getUser()) {
                wx.navigateTo({
                    url: `/pages/login/login`,
                });
                return;
            } 
            this.getDetail();
            this.getMyTodayList();
        }
    }
});