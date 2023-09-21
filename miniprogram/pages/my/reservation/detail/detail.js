// pages/my/reservation/detail/detail.js
import Token from '../../../../utils/token';
import ReservationApi from '../../../../apis/reservation';
import { drawImg } from '../../../../utils/qrcode';
import { ApiCode } from '../../../../apis/cloud';

Component({
    properties: {
        id: String
    },
    data: {
        isLoad: false,

		isShowHome: false,
    },
    methods: {
        bindJumpUrl (e) {
			wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
		},
        async getDetail() {
            const id = this.data.id;
            if (!id) return;
            
            const res = await ReservationApi.getDetail(id);

            if (res.code == ApiCode.SUCCESS) {
                if (!res.data) {
                    this.setData({
                        isLoad: null
                    })
                    return;
                }

                let qrImageData = drawImg('stadium=' + res.data.code, {
					typeNumber: 1,
					errorCorrectLevel: 'L',
					size: 100
                });
                
                this.setData({
                    isLoad: true,
					reservation: res.data,
					qrImageData
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
        }
    }
})