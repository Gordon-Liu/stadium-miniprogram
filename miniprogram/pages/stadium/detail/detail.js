// pages/stadium/detail/detail.js
import { STADIUM_CAN_NULL_TIME } from '../../../settings/setting';
import StadiumApi from '../../../apis/stadium';
import { ApiCode } from '../../../apis/cloud';
import { dataset } from '../../../utils/util';
import { showModal } from '../../../utils/confirm';
import Token from '../../../utils/token';

Component({
    properties: {
        id: String
    },
    data: {
        isLoad: false,


		tabCur: 0,
		mainCur: 0,
		verticalNavTop: 0,

		showMind: true,
		showTime: false,
    },
    methods: {
        bindPreview (e) {
            console.log(e)
			let url = e.currentTarget.dataset.url;
            if (url.indexOf('qlogo') > -1) { //微信大图
                url = url.replace('/132', '/0');
            }
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: [url]
            });
        },
        bindTop () {
			wx.pageScrollTo({
				scrollTop: 0
			})
		},
        async bindJoin (e) {
            if (!Token.getUser()) {
                wx.navigateTo({
                    url: `/pages/login/login`,
                });
            } 

			const dayIdx = dataset(e, 'dayidx');
			const timeIdx = dataset(e, 'timeidx');

			const time = this.data.stadium.days_set[dayIdx].times[timeIdx];


			if (time.error) {
				if (time.error.includes('预约'))
					return showModal('该时段' + time.error + '，换一个时段试试吧！');
				else
					return showModal('该时段预约' + time.error + '，换一个时段试试吧！');
			}

			const id = this.data.id;
			const timeMark = time.mark;

            const res = await StadiumApi.beforeReservation(id, timeMark);
            if (res.code == ApiCode.SUCCESS) {
                wx.navigateTo({
                    url: `/pages/stadium/reservation/reservation?id=${id}&timeMark=${timeMark}`,
                });
            }
        },
        bindVerticalMainScroll (e) {
			if (!this.data.isLoad) return;

			const list = this.data.stadium.days_set;
			let tabHeight = 0;

			for (let i = 0; i < list.length; i++) {
				const view = wx.createSelectorQuery().in(this).select("#main-" + i);
				view.fields({
					size: true
				}, data => {
					list[i].top = tabHeight;
					tabHeight = tabHeight + data.height;
					list[i].bottom = tabHeight;
				}).exec();
			}

			const scrollTop = e.detail.scrollTop + 20; // + i*0.5; //TODO
			for (let i = 0; i < list.length; i++) {

				if (scrollTop > list[i].top && scrollTop < list[i].bottom) {

					this.setData({
						verticalNavTop: (i - 1) * 50,
						tabCur: i
					})
					return false;
				}
			}
		},

		bindTabSelect (e) {
			let idx = dataset(e, 'idx');
			this.setData({
				tabCur: idx,
				mainCur: idx,
				verticalNavTop: (idx - 1) * 50
			})
		},

		bindShowMind (e) {
			this.setData({
				showMind: true,
				showTime: false
			});
		},

		bindShowTime (e) {
			this.setData({
				showMind: false,
				showTime: true
			});
		},
        async getDetail () {
            const id = this.data.id;
            if (!id) return;
            
            const res = await StadiumApi.getDetail(id);

            if (res.code == ApiCode.SUCCESS) {
                if (!res.data) {
                    this.setData({
                        isLoad: null
                    })
                    return;
                }
                this.setData({
                    isLoad: true,
                    stadium: res.data,
                    canNullTime: STADIUM_CAN_NULL_TIME
                });
            }
        },
        async onPullDownRefresh () {
			await this.getDetail();
			wx.stopPullDownRefresh();
        },
        onPageScroll (e) {
			if (e.scrollTop > 100) {
				this.setData({
					topShow: true
				});
			} else {
				this.setData({
					topShow: false
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