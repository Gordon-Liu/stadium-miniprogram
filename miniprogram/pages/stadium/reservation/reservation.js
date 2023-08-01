const { ApiCode } = require("../../../apis/cloud");
const { default: StadiumApi } = require("../../../apis/stadium");

// pages/stadium/reservation/reservation.js
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
            let opts = {
                title: '提交中'
            }
            let params = {
                meetId: this.data.id,
                timeMark: this.data.timeMark,
                forms
            }
            await cloudHelper.callCloudSumbit('meet/join', params, opts).then(res => {
                let content = '预约成功！'

                let joinId = res.data.id;
                wx.showModal({
                    title: '温馨提示',
                    showCancel: false,
                    content,
                    success() {
                        wx.reLaunch({
                            url: pageHelper.fmtURLByPID('/pages/my/reservation/detail/detail?flag=home&id=' + joinId),
                        });
                    }
                })
            });
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