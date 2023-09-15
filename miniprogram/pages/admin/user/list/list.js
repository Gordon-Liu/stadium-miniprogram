// pages/admin/user/list/list.js
import AdminToken from '../../../../utils/admin-token';
import listBehavior from '../../../../cmpts/behavior/list';
import { loginExpirationConfirm } from '../../../../utils/confirm';
import { showSuccessToast } from '../../../../utils/toast';
import { dataset } from '../../../../utils/util';
import AdminUserApi from '../../../../apis/admin/user';
import { ApiCode } from '../../../../apis/cloud';

Component({
    behaviors: [listBehavior],
    data: {
        isAdmin: false,
    },
    methods: {
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        async bindDelTap(e) {
            const id = dataset(e, 'id');

            const res = await AdminUserApi.delete(id);
            if (res.code === ApiCode.SUCCESS) {
                const index = this.data.dataList.list.findIndex(item => item.id == id);
                if (index >= 0) {
                    this.data.dataList.list.splice(index, 1);
                    this.data.dataList.total--;
                    this.setData({
                        dataList: this.data.dataList
                    });
                }
                showSuccessToast('删除成功');
            }
        },
        getSearchMenu() {
            const sortItems = [];
            const sortMenus = [{
                    label: '全部',
                    type: '',
                    value: ''
                }, {
                    label: '正常',
                    type: 'status',
                    value: 1
                }, 
                {
                    label: '注册时间正序',
                    type: 'sort',
                    value: 'newasc'
                },
                {
                    label: '注册时间倒序',
                    type: 'sort',
                    value: 'newdesc'
                },

            ]
            this.setData({
                sortItems,
                sortMenus
            })
        }
    },
    lifetimes: {
        attached() {
            const admin = AdminToken.getAdmin();
            if (!admin) {
                loginExpirationConfirm();
            } else {
                this.setData({
                    isAdmin: true,
                });
                this.getSearchMenu();
            }
        }
    }
});