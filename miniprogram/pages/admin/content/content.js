// pages/admin/content/content.js
import AdminToken from '../../../utils/admin-token';
import { loginExpirationConfirm } from '../../../utils/confirm';
import { getPrevPage } from '../../../utils/page';

Component({

    /**
     * 页面的初始数据
     */
    data: {
        formContent: [{
			type: 'text',
			val: '',
		}]
    },
    methods: {
        bindBack() {
            wx.navigateBack({
                delta: 0,
            });
        },
        bindSave (e) {
            const formContent = this.selectComponent('#contentEditor').getNodeList();
    
            const parent = getPrevPage(2);
            if (!parent) return;
            
            parent.setData({
                formContent
            },  () => {
                parent.bindSetContentDesc();
            });
    
            wx.navigateBack({
                delta: 0,
            });
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
                    isLoad: true
                });
                const parent = getPrevPage(2);
                if (!parent) return;

                const formContent = parent.data.formContent;
                if (formContent && formContent.length > 0) {
                    this.setData({
                        formContent
                    });
                }
            }
        } 
    }
});