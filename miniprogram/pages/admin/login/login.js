// pages/admin/login/login.js
import AdminHomeApi from '../../../apis/admin/home';
import { ApiCode } from '../../../apis/cloud';
import AdminToken from '../../../utils/admin-token';

Component({
    data: {
        name: '',
        password: '',
    },
    methods: {
        bindInputName(e) {
            this.setData({
                name: e.detail.value 
            });
        },
        bindInputPassword(e) {
            this.setData({
                password: e.detail.value 
            });
        },
        async bindLogin() {
            if (this.data.name.length < 5 || this.data.name.length > 30) {
                wx.showToast({
                    title: '账号输入错误(5-30位)',
                    icon: 'none'
                });
                return;
            }
    
            if (this.data.password.length < 5 || this.data.password.length > 30) {
                wx.showToast({
                    title: '密码输入错误(5-30位)',
                    icon: 'none'
                });
                return;
            }
            const res = await AdminHomeApi.login(this.data.name, this.data.password);
            if (res.code === ApiCode.SUCCESS) {
                AdminToken.setAdmin(res.data);
				wx.reLaunch({
					url: '/pages/admin/home/home',
				});
            }
            
        },
        bindBack() {
            wx.switchTab({
                url: '/pages/my/my',
            });
        }
    }
});