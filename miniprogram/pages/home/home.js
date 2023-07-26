// pages/home/home.js
import NewsApi from '../../apis/news';
import { ApiCode } from '../../apis/cloud';

Component({
    data: {
        menu: [
            '场馆动态',
            '运动常识',
            '羽毛球场预约',
            '足球场预约',
            '篮球场预约',
            '乒乓球预约',
            '网球场预约',
            '游泳馆预约',
            '健身房预约'
        ],
        dataList: null
    },
    methods: {
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