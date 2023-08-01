// pages/news/stadium/stadium.js
import listBehavior from '../../../cmpts/behavior/list';

Component({
    behaviors: [listBehavior],
    data: {
        _params: {
            cateId: 1
        }
    },
    methods: {
        bindJumpUrl(e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
    },
});