// pages/home/home.js
import Statium from '../../apis/stadium';
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
        list: null
    },
    methods: {
        async getSadiumList () { 
			let opts = {
				title: 'bar'
			}
			// await cloudHelper.callCloudSumbit('news/home_list', {}, opts).then(res => {
			// 	this.setData({
			// 		list: res.data
			// 	});
            // })
            const res = await Statium.homeList();
            if (res.code === ApiCode.SUCCESS) {
                this.setData({
                    list: res.data
                });
            }
            
		},
    },
    lifetimes: {
        attached() {
            this.getSadiumList();
        }
    }
});