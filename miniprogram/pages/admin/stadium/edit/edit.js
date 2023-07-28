// pages/admin/stadium/edit/edit.js
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm, showModal } from '../../../../utils/confirm';
import { showSuccessToast } from '../../../../utils/toast';
import { anchor } from '../../../../utils/page';
import { check } from '../../../../utils/validate';
import { time } from '../../../../utils/time';
import stadiumFormBehavior from '../../../../behaviors/stadium-form';
import AdminStadiumApi from '../../../../apis/admin/stadium';
import { ApiCode } from '../../../../apis/cloud';
import { removeCacheList } from '../../../../utils/cache-list';

function getLeaveDay(days) {
    let now = timeHelper.time('Y-M-D');
    let count = 0;
    for (let k in days) {
        if (days[k].day >= now) count++;
    }
    return count;
}


Component({
    behaviors: [stadiumFormBehavior],
    data: {
        isAdmin: false,
        isLoad: false,
		id: null,
    },
    methods: {
        bindSelectCate(e) {
            this.setData({
                formTypeId: e.detail
            });
        },
        bindShowModal(e) {
            showModal(e.currentTarget.dataset.url);
        },
        bindFormSetCmpt (e) {
            this.setData({
                formFormSet: e.detail,
            });
        },
        bindFormAddSubmit: async function () {
            this.bindFormClearFocus();
    
            if (!AdminToken.getAdmin()) return loginExpirationConfirm();
    
            let data = this.data;
            if (data.formTitle.length <= 0) return this.bindFormHint('formTitle', '请填写「标题」');
    
            if (data.formTypeId.length <= 0) return this.bindFormHint('formTypeId', '请选择「分类」');
    
            if (data.formStyleSet.pic.length <= 0) {
                anchor('formStyleSet', this);
                return this.bindFormHint('formStyleSet', '封面图片未设置');
            }
            if (data.formDaysSet.length <= 0) {
                anchor('formDaysSet', this);
                return this.bindFormHint('formDaysSet', '请配置「可预约时段」');
            }
            if (data.formFormSet.length <= 0) return showModal('请至少设置一项「用户填写资料」');
    
            if (data.contentDesc.includes('未填写'))
                return this.bindFormHint('formContent', '请填写「详细介绍」');
    
            data = check(data, this.data.CHECK_FORM, this);
            if (!data) return;
            data.typeName = this.getTypeName();

            await this.bindUpdateMeetCotnentPic(this.data.formContent);
            data.content = this.data.formContent;

            await this.bindUpdateMeetStyleSet(this.data.formStyleSet);
            data.styleSet = this.data.formStyleSet;
            
            // 先创建，再上传 
            const res = await AdminStadiumApi.insert(data);

            if (res.code == ApiCode.SUCCESS) {
                const callback = async function () {
                    removeCacheList('admin-stadium');
                    removeCacheList('stadium-list');
                    wx.navigateBack();
    
                }
                showSuccessToast('添加成功', 2000, callback);
            }
    
        },
    
        async bindFormEditSubmit () {
            this.bindFormClearFocus();

            if (!AdminToken.getAdmin()) return loginExpirationConfirm();
    
            const data = this.data;
            if (data.formTitle.length <= 0) return this.bindFormHint('formTitle', '请填写「标题」');
    
            if (data.formTypeId.length <= 0) return this.bindFormHint('formTypeId', '请选择「分类」');
    
            if (data.formStyleSet.pic.length <= 0) {
                anchor('formStyleSet', this);
                return this.bindFormHint('formStyleSet', '封面图片未设置');
            }
            if (data.formDaysSet.length <= 0) {
                anchor('formDaysSet', this);
                return this.bindFormHint('formDaysSet', '请配置「可预约时段」');
            }
            if (data.formFormSet.length <= 0) return showModal('请至少设置一项「用户填写资料」');
    
            data = check(data, data.CHECK_FORM, this);
            if (!data) return;
            data.typeName = this.getTypeName();
    
            data.id = this.data.id;

            await this.bindUpdateMeetCotnentPic(this.data.formContent);
            data.content = this.data.formContent;

            await this.bindUpdateMeetStyleSet(this.data.formStyleSet);
            data.styleSet = this.data.formStyleSet;

            // 先修改，再上传 
            const res = await AdminStadiumApi.edit(data);
        
            if (res.code == ApiCode.SUCCESS) {

                const callback = async function () { 
                    // 更新列表页面数据
                    let node = {
                        'title': data.title,
                        'type_name': data.typeName,
                        'days_set': data.daysSet,
                        'form_set': data.formSet,
                        'edit_time': time('Y-M-D h:m:s'),
                        'leaveDay': getLeaveDay(data.daysSet)
                    }
                    // pageHelper.modifyPrevPageListNodeObject(meetId, node);
                    wx.navigateBack();

                }
                showSuccessToast('编辑成功', 2000, callback);
            }    
    
        },
        bindMyImgUploadListener (e) {
            this.setData({
                imgList: e.detail
            });
        },
        async getDetail() {
            const id = this.data.id;
            if (!id) return;
            
            const res = await StadiumApi.

            this.setData({
                isLoad: true,
                // 表单数据   
                formTitle: res.data.title,
                formTypeId: res.data.type_id,
                formContent: res.data.content,
                formOrder: res.data.order,
                formStyleSet: res.data.style_set,

                formDaysSet: res.data.days_set,

                formIsShowLimit: res.data.is_show_limit,

                formFormSet: res.data.form_set,
            });
        },
        async onPullDownRefresh () {
            await this.getDetail();
            wx.stopPullDownRefresh();
        },
    },
    lifetimes: {
        async attached() {
            const admin = AdminToken.getAdmin();
            if (!admin) {
                loginExpirationConfirm();
            } else {
                this.setData({
                    isAdmin: true,
                    isLoad: true
                });
                await this.getDetail();
                this.bindSetContentDesc();
            }
        }
    }
});