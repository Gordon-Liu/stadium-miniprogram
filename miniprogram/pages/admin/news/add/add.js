// pages/admin/news/add/add.js
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm, showModal } from '../../../../utils/confirm';
import { showSuccessToast } from '../../../../utils/toast';
import { check } from '../../../../utils/validate';
import { removeCacheList } from '../../../../utils/cache-list';
import newFormBehavior from '../../../../behaviors/new-form';
import AdminNewsApi from '../../../../apis/admin/news';
import { ApiCode } from '../../../../apis/cloud';
import { AdminClient } from '../../../../apis/cloud';
import { NEWS_PIC_PATH } from '../../../../settings/setting';

Component({
    behaviors: [newFormBehavior],
    data: {
        isAdmin: false,
        isLoad: false
    },
    methods: {
        /** 
         * 数据提交
         */
        async bindFormSubmit () { 
            if (!AdminToken.getAdmin()) return loginExpirationConfirm();

            let data = {...this.data};
            // 数据校验  by 类型
            if (data.formType == 0) { // 内部
                data = check(data, data.CHECK_FORM);
            } else { // 外部
                data = check(data, data.CHECK_FORM_OUT);
            }
            
            if (!data) return;
            data.cateName = this.getCateName();


            if (this.data.imgList.length == 0) {
                return showModal('请上传封面图');
            }

            // 提取简介
            data.desc = this.getDesc(data.desc, this.data.formContent);
            
            if (this.data.formContent.length == 0) {
                return showModal('详细内容不能为空');
            }
            data.content = this.data.formContent;

            const imgList = this.data.imgList;
            // 图片上传到云空间
            const adminClient = new AdminClient();
            const pic = await adminClient.uploadImage(imgList, NEWS_PIC_PATH);
            data.pic = pic;

            const res = await AdminNewsApi.insert(data);
            if (res.code === ApiCode.SUCCESS) {
                const callback = async function () {
                    removeCacheList('admin-news');
                    removeCacheList('news-list');
                    wx.navigateBack();
                }
                showSuccessToast('添加成功', 2000, callback);
            }
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
                    isLoad: true
                });
                this.bindSetContentDesc();
            }
        }
    }
});