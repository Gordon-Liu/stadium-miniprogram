// pages/stadium/list/list.js
import listBehavior from '../../../cmpts/behavior/list';

Component({
    behaviors: [listBehavior],
    properties: {
        id: Number
    },
    data: {
        listMode: '',
        _params: null,
        types: [{
            label: '羽毛球场预约',
            mode: 'leftbig2',
            value: 1
        }, {
            label: '足球场预约',
            mode: 'leftbig3',
            value: 2
        }, {
            label: '篮球场预约',
            mode: 'leftbig',
            value: 3
        }, {
            label: '乒乓球预约',
            mode: 'upimg',
            value: 4
        }, {
            label: '网球场预约',
            mode: 'upimg',
            value: 5
        }, {
        label: '游泳馆预约',
            mode: 'upimg',
            value: 6
        }, {
            label: '健身房预约',
            mode: 'leftbig3',
            value: 7
        }],
    },
    methods: {
        bindJumpUrl (e) {
			wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
		},
        bindSetTypeTitle: function (typeId) {
            const type = this.data.types.find(item => item.value == typeId);
            this.setData({
                listMode: type.mode
            });
			wx.setNavigationBarTitle({
				title: type.label
			});
		}
    },
    lifetimes: {
        attached() {
            if (this.data.id) {
				this.setData({
					_params: {
						typeId: this.data.id,
					}
                });
                this.bindSetTypeTitle(this.data.id);
			}
        }
    }
})