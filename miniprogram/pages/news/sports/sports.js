// pages/news/sports/sports.js
import listBehavior from '../../../cmpts/behavior/list';

Component({
    behaviors: [listBehavior],
    data: {
        _params: {
            cateId: 2
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