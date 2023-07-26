import { fmtText } from '../utils/data';

export default Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {
        
	},
	methods: {
        bindSetContentDesc() {
            
        },
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
	}
});