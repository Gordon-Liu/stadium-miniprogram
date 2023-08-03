// pages/my/edit/edit.js
import { ApiCode } from '../../../apis/cloud';
import UserApi from '../../../apis/user';
import { showModal } from '../../../utils/confirm';
import { showSuccessToast } from '../../../utils/toast';
import { check } from '../../../utils/validate';

Component({
    data: {
        isLoad: false
    },
    methods: {
        async bindGetPhoneNumber (e) {
			if (e.detail.errMsg == 'getPhoneNumber:ok') {

			} else
				wx.showToast({
					title: '手机号码获取失败，请重新绑定手机号码',
					icon: 'none'
				});
		},
		async bindSubmit (e) {
			let data = this.data;
            // const mobile = data.formMobile;
            // if (mobile.length != 11) return showModal('请填写正确的手机号码');

            const CHECK_FORM = {
                name: 'formName|must|string|min:1|max:20|name=姓名',
                mobile: 'formMobile|must|len:11|name=手机',
                city: 'formCity|string|max:100|name=所在城市',
                work: 'formWork|string|max:100|name=所在单位',
                trade: 'formTrade|string|max:100|name=行业领域',
            };
            // 数据校验 
            data = check(data, CHECK_FORM, this);
            if (!data) return;

            const res = await UserApi.edit(data);
            if (res.code == ApiCode.SUCCESS) {
                const callback = () => {
                    wx.navigateBack();
                }
                showSuccessToast('提交成功', 1500, callback);
            }
        },
        async getDetail() {
            const res = await UserApi.getDetail();
            if (res.code === ApiCode.SUCCESS) {
                if (!res.data) {
                    this.setData({
                        isLoad: true,
                        formName: '',
                        formMobile: '',
                        formCity: '',
                        formWork: '',
                        formTrade: ''
                    });
                    return;
                };
                this.setData({ 
                    isLoad: true,
                    formName: res.data.name,
                    formMobile: res.data.mobile,
                    formTrade: res.data.trade,
                    formWork: res.data.work,
                    formCity: res.data.city
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