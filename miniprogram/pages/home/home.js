// pages/home/home.js
import NewsApi from '../../apis/news';
import { ApiCode } from '../../apis/cloud';

Component({
    data: {
        menu: [
            {
                label: '场馆动态',
                type: 'cateId',
                value: 1
            }, {
                label: '运动常识',
                type: 'cateId',
                value: 2
            }, {
                label: '羽毛球场预约',
                type: 'typeId',
                value: 1
            }, {
                label: '足球场预约',
                type: 'typeId',
                value: 2
            }, {
                label: '篮球场预约',
                type: 'typeId',
                value: 3
            }, {
                label: '乒乓球预约',
                type: 'typeId',
                value: 4
            }, {
                label: '网球场预约',
                type: 'typeId',
                value: 5
            }, {
                label: '游泳馆预约',
                type: 'typeId',
                value: 6
            }, {
                label: '健身房预约',
                type: 'typeId',
                value: 7
            }
        ],
        dataList: null
    },
    methods: {
        bindJumpMenu(e) {
            const item = e.currentTarget.dataset.item;
            if (item.type == 'cateId') {
                wx.switchTab({
                  url: '/pages/news/' + (item.value === 1 ? 'stadium/stadium' : 'sports/sports')
                });
            } else if (item.type == 'typeId') {
                wx.navigateTo({
                  url: '/pages/stadium/list/list?id=' + item.value,
                });
            }
        },
        bindJumpUrl(e) {
            console.log( e.currentTarget.dataset.url)
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        async getNewsList () { 
            const res = await NewsApi.homeList();
            if (res.code === ApiCode.SUCCESS) {
                this.setData({
                    dataList: res.data
                });
            }
            
		},
    },
    lifetimes: {
        attached() {
            this.getNewsList();
        }
    }
});