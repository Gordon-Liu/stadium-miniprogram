import { isDefined } from '../../utils/util';
export default Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {
        search: '',
        sortType: '',
        dataList: null,
        sortMenus: [],
        sortMenus: [],
	},
	methods: {
         /**
         * 配合搜索列表响应监听
         * @param {*} that 
         */
        bindCommListListener(e) {
            if (isDefined(e.detail.search))
                this.setData({
                    search: '',
                    sortType: '',
                });
            else {
                this.setData({
                    dataList: e.detail.dataList,
                });
                if (e.detail.sortType)
                    this.setData({
                        sortType: e.detail.sortType,
                    });
            }
        }
	}
});