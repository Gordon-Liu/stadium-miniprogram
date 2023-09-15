// pages/admin/user/export/export.js
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm, showModal } from '../../../../utils/confirm';
import { showSuccessToast, showNoneToast } from '../../../../utils/toast';
import { dataset } from '../../../../utils/util';
import AdminExportApi from '../../../../apis/admin/export';
import { ApiCode } from '../../../../apis/cloud';


Component({
    properties: {
        condition: {
            type: String,
            value: '',
        }
    },
	data: {
		url: '',
		time: '',
        
        isAdmin: false,
		isLoad: false,
    },
    methods: {
        bindOpenTap(e) {
            fileHelper.openDoc('客户数据', this.data.url);
        },
        async url (e) {
            pageHelper.url(e, this);
        },
        async bindExportTap () {
            const res = await AdminExportApi.userDataExport(this.data.condition);
            if (res.code === ApiCode.SUCCESS) {
                this.getDetail(0);
                showModal('数据文件生成成功(' + res.data.total + '条记录), 请点击「直接打开」按钮或者复制文件地址下载');
            } else {
                showNoneToast('导出失败，请重试');
            }
        },

        bindDelTap: async function (e) {
            try {
                let options = {
                    title: '数据删除中'
                }
                await cloudHelper.callCloudData('admin/user_data_del', {}, options).then(res => {
                    this.setData({
                        url: '',
                        time: ''
                    });
                    pageHelper.showSuccToast('删除成功');
                });
            } catch (err) {
                console.log(err);
                pageHelper.showNoneToast('删除失败，请重试');
            }

        },
        async getDetail (isDel) {
            const res = await AdminExportApi.userDataGet(isDel);
            if (res.code === ApiCode.SUCCESS) {
                if (!res.data) return;
    
                this.setData({
                    isLoad: true,
                    url: res.data.url,
                    time: res.data.time
                })
            }
        },
        async onPullDownRefresh() {
            await this.getDetail(1);
            wx.stopPullDownRefresh();
        },
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
                this.getDetail(1);
            }
        }
    }
});