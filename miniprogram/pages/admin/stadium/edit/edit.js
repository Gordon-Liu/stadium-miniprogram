// pages/admin/stadium/edit/edit.js
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm, showModal } from '../../../../utils/confirm';
import stadiumFormBehavior from '../../../../behaviors/stadium-form';

Component({
    behaviors: [stadiumFormBehavior],
    data: {
        isAdmin: false,
        isLoad: false,
		id: null,
    },
    methods: {
        bindShowModal(e) {
            showModal(e.currentTarget.dataset.url);
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
        }
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