// pages/admin/user/list/list.js
import AdminToken from '../../../../utils/admin-token';
import listBehavior from '../../../../cmpts/behavior/list';
import { loginExpirationConfirm } from '../../../../utils/confirm';

Component({
    behaviors: [listBehavior],
    data: {
        isAdmin: false,
    },
    methods: {
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