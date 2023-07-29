import { deepClone, genRandomAlpha } from '../utils/data';

export default Behavior({
	/**
	 * 页面的初始数据
	 */
    data: {
        TIME_NODE: {
            mark: 'mark-no',
            start: '00:00', //开始
            end: '23:59', // 结束
            limit: 50, //人数限制
            isLimit: false,
            status: 1,
            stat: { //统计数据 
                succCnt: 0,
                cancelCnt: 0,
                adminCancelCnt: 0,
            }
        }
    },
	methods: {
        getNewTimeNode(day) {
            let node = deepClone(this.data.TIME_NODE);
            day = day.replace(/-/g, '');
            node.mark = 'T' + day + 'AAA' + genRandomAlpha(10).toUpperCase();
            return node;
        }
    }
});