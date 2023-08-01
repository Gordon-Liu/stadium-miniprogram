import { ApiCode } from "../../../apis/cloud";
import NewsApi from "../../../apis/news";

// pages/news/detail/detail.js
Component({
    properties: {
        id: String
    },
    data: {
        isLoad: false,
    },
    methods: {
        async getDetail() {
            const id = this.data.id;
			if (!id) return;

            const res = await NewsApi.getDetail(id);

            if (res.code == ApiCode.SUCCESS) {
                if (!res.data) {
                    this.setData({
                        isLoad: null
                    })
                    return;
                }
                this.setData({
                    isLoad: true,
                    news: res.data,
                });
            }

        },
        async onPullDownRefresh () {
			await this.getDetail();
			wx.stopPullDownRefresh();
        },
        onPageScroll (e) {
			// 回页首按钮
			if (e.scrollTop > 100) {
                that.setData({
                    topBtnShow: true
                });
            } else {
                that.setData({
                    topBtnShow: false
                });
            }
		},
    },
    lifetimes: {
        attached() {
            this.getDetail();
        }
    }
});