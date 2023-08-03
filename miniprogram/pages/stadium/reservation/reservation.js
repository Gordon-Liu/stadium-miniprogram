// pages/stadium/reservation/reservation.js
import { ApiCode } from '../../../apis/cloud';
import StadiumApi from '../../../apis/stadium';

Component({
    properties: {
        id: String,
        timeMark: String
    },
    data: {
        isLoad: false,

		forms: [{
			mark: 'PCERZITIQH',
			val: [2, 1],
			title: 't111',
			type: 'line'
		}, {
			mark: 'SDFHUJWMLF',
			val: [false],
			title: 't111',
			type: 'line'
		}, {
			mark: 'KWTHSZLIVF1',
			val: '555',
			title: '电话1',
			type: 'line'
		}, {
			mark: 'ccc',
			val: ['广东省', '深圳市', ''],
			title: '地区1',
			type: 'mobile'
		}, {
			mark: 'ALETOSCFPZ',
			val: '777',
			title: '女朋友',
			type: 'idcard'
		}],
    },
    methods: {
        bindBack() {
            wx.navigateBack();
        },
        bindCheck (e) {
			this.selectComponent('#form-show').checkForms();
        },
        async bindSubmitCmpt (e) {
			const forms = e.detail;
            const res = await StadiumApi.reservation(this.data.id, this.data.timeMark, forms);
            if (res.code == ApiCode.SUCCESS) {
                const reservationId = res.data.id;
                wx.showModal({
                    title: '温馨提示',
                    showCancel: false,
                    content: '预约成功！',
                    success() {
                        wx.redirectTo({
                          url: '/pages/my/reservation/reservation?id=' + reservationId,
                        });
                    }
                })
            }
		},
        async getDetail() {
            const id = this.data.id;
			if (!id) return;

			const timeMark = this.data.timeMark;
            if (!timeMark) return;
            
            const res = await StadiumApi.getDetailForReservation(id, timeMark);
            if (res.code == ApiCode.SUCCESS) {
                if (!res.data) {
                    this.setData({
                        isLoad: null
                    })
                    return;
                }

                this.setData({
                    isLoad: true,
                    stadium: res.data
                });
            }
        },
        async onPullDownRefresh () {
			await this.getDetail();
			wx.stopPullDownRefresh();
		},
    },
    lifetimes: {
        attached() {
            this.getDetail();
        }
    }
});