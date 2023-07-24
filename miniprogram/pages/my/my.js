// pages/my/my.js
import { ApiCode } from '../../apis/cloud';
import ReservationApi from '../../apis/reservation';
import { time } from '../../utils/time';
import { clear } from '../../utils/cache';
import { showNoneToast } from '../../utils/toast';

Component({
    data: {
        user: null,
        myTodayList: null
    },
    methods: {
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
            this.getMyTodayList();
        }
    }
});