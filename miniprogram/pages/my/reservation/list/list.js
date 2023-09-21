// pages/my/reservation/list/list.js
import listBehavior from '../../../../cmpts/behavior/list';
import { dataset } from '../../../../utils/util';
import { showConfirm } from '../../../../utils/confirm';

Component({
    behaviors: [listBehavior],
    data: {

    },
    methods: {
        bindJumpUrl (e) {
			wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
		},
        async bindCancelTap(e) {
			const callback = async () => {
				const reservationId = dataset(e, 'id');
				try {
					let params = {
						id
					}
					let opts = {
						title: '取消中'
					}

					await cloudHelper.callCloudSumbit('my/my_join_cancel', params, opts).then(res => {
						pageHelper.modifyListNode(joinId, this.data.dataList.list, 'JOIN_STATUS', 10, '_id');
						this.setData({
							dataList: this.data.dataList
						});
						pageHelper.showNoneToast('已取消');
					});
				} catch (err) {
					console.log(err);
				}
			}

			showConfirm('确认取消该预约?', callback);
		},
        getSearchMenu() {
			const sortItems = [[{
				label: '排序',
				type: '',
				value: ''
			}, {
				label: '按时间倒序',
				type: 'timedesc',
				value: ''
			}, {
				label: '按时间正序',
				type: 'timeasc',
				value: ''
			}]];
			const sortMenus = [{
					label: '全部',
					type: '',
					value: ''
				}, {
					label: '今日',
					type: 'today',
					value: ''
				}, {
					label: '明日',
					type: 'tomorrow',
					value: ''
				}, {
					label: '已预约',
					type: 'succ',
					value: ''
				},
				{
					label: '已取消',
					type: 'cancel',
					value: ''
				}
			]

			this.setData({
				sortItems,
				sortMenus
			});

		},
    },
    lifetimes: {
        attached() {
            this.getSearchMenu();
        }
    }
})