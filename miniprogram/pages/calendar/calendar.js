// pages/calendar/calendar.js
import { ApiCode } from '../../apis/cloud';
import StadiumApi from '../../apis/stadium';
import { time } from '../../utils/time';

Component({
    data: {
        isLoad: false,
		list: [],

		day: '',
		hasDays: []
    },
    methods: {
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        async bindClickCmpt (e) {
			let day = e.detail.day;
			this.setData({
				day
			}, async () => {
				await this.getList();
			})

		},
		bindMonthChangeCmpt (e) {
			console.log(e.detail)
		},
        async getHasList() {
            
            const res = await StadiumApi.getListHasDay(time('Y-M-D'));
            if (res.code == ApiCode.SUCCESS) {
                this.setData({
                    hasDays: res.data,
                });
            }
        },
        async getList() {

            const res = await StadiumApi.getListByDay(this.data.day);
            if (res.code == ApiCode.SUCCESS) {
                this.setData({
                    list: res.data,
                    isLoad: true
                });
            } else {
                this.setData({
                    isLoad: null
                })
            }
        },
        async onPullDownRefresh() {
			await this.getHasList();
			await this.getList();
			wx.stopPullDownRefresh();
		},
    },
    lifetimes: {
        attached() {
            this.setData({
				day: time('Y-M-D')
			}, async () => {
				await this.getHasList();
				await this.getList();
			});
        }
    }
})