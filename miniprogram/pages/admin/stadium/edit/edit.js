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
            this.setData({
                isLoad: true
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