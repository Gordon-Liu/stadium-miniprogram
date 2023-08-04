// pages/admin/stadium/record/record.js
import AdminStadiumApi from '../../../../apis/admin/stadium';
import { ApiCode } from '../../../../apis/cloud';
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm } from '../../../../utils/confirm';
import { time } from '../../../../utils/time';

Component({
    properties: {
        stadiumId: String,
        title: String,
    },
    data: {
        isLoad: false,

		now: time('Y-M-D'),

		searchDayStart: '',
		searchDayEnd: '',

        daysSet: null,
        
		titleEn: '',
    },
    methods: {
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        async getDetail() {
            const stadiumId = this.data.stadiumId;
            if (!stadiumId) return;

            this.setData({
				daysSet: null
            });
            
            const res = await AdminStadiumApi.dayList(stadiumId, this.data.searchDayStart, this.data.searchDayEnd);
            if (res.code == ApiCode.SUCCESS) {
                this.setData({
					isLoad: true,
					daysSet: res.data
				}); 
            }
        }
    },
    lifetimes: {
        attached() {
            if (!this.data.stadiumId) return;
            const admin = AdminToken.getAdmin();
            if (!admin) {
                loginExpirationConfirm();
            } else {
                const searchDayStart = time('Y-M-D');
                const searchDayEnd = time('Y-M-D');
                
                this.setData({
                    isAdmin: true,
                    searchDayStart,
                    searchDayEnd
                }, () => {
                    this.getDetail();
                });

                if (this.data.title) {
                    const title = decodeURIComponent(this.data.title);
                    this.setData({
                        title,
                        titleEn: this.data.title
                    });
                    wx.setNavigationBarTitle({
                        title: '预约名单统计 - ' + title
                    });
                }
            }
        }
    }
})