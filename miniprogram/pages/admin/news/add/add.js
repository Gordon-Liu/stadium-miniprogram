// pages/admin/news/add/add.js
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm, showModal } from '../../../../utils/confirm';
import { showSuccessToast } from '../../../../utils/toast';
import { check } from '../../../../utils/validate';
import behavior from '../../../../behaviors/news';
import AdminNewsApi from '../../../../apis/admin/news';
import { ApiCode } from '../../../../apis/cloud';
import { AdminClient } from '../../../../apis/cloud';
import { NEWS_PIC_PATH } from '../../../../settings/setting';

Component({
    behaviors: [behavior],
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
                if (this.data.formContent.length == 0) {
                    return showModal('详细内容不能为空');
                }
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
            // 先创建，再上传 
            const res = await AdminNewsApi.insert(data);
            if (res.code === ApiCode.SUCCESS) {
                const newsId = result.data.id;
                // 图片 提交处理 
                wx.showLoading({
                    title: '提交中...',
                    mask: true
                });
                let imgList = this.data.imgList;
                // 图片上传到云空间
                const adminClient = new AdminClient();
                imgList = await adminClient.uploadImage(imgList, NEWS_PIC_PATH, newsId);
        
                // 更新本记录的图片信息
                await AdminNewsApi.updatePic(newsId, imgList);
                return
                const formContent = this.data.formContent;
                if (formContent && formContent.length > 0) {
                    wx.showLoading({
                        title: '提交中...',
                        mask: true
                    });
                    await AdminNewsBiz.updateNewsCotnentPic(newsId, formContent, this);
                }

                const callback = async function () {
                    bizHelper.removeCacheList('admin-news');
                    bizHelper.removeCacheList('news-list');
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