// pages/admin/stadium/content/content.js
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm } from '../../../../utils/confirm';
import { getPrevPage } from '../../../../utils/page';

Component({
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