// pages/admin/stadium/cover/cover.js
import AdminToken from '../../../../utils/admin-token';
import { showConfirm, showModal, loginExpirationConfirm } from '../../../../utils/confirm';
import { fmtText } from '../../../../utils/data';
import { getPrevPage } from '../../../../utils/page';

Component({
    data: {
        title: '',
		status: '',

		mode: '',
		desc: '',
		pic: '',
    },
    methods: {
        bindPreview (e) {
            const url = e.currentTarget.dataset.url;
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: [url]
            });
        },
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        bindBack() {
            wx.navigateBack({
                delta: 0,
            });
        },
    
        bindChooseImg (e) {
            wx.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], //从相册选择
                success: (res) => {
                    let pic = res.tempFiles[0].tempFilePath;
                    this.setData({
                        pic
                    });
                }
            });
        },
        bindDelImg (e) {
            let callback = () => {
                this.setData({
                    pic: ''
                });
            }
            showConfirm('确定要删除该图片吗？', callback);
        },
    
        bindSave (e) {
            const parent = getPrevPage(2);
            if (!parent) return;
    
            if (!this.data.pic) return showModal('请上传封面图片');
    
            parent.setData({
                formStyleSet: {
                    desc: fmtText(this.data.desc),
                    pic: this.data.pic
                }
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
                const parent = getPrevPage(2);
                if (!parent) return;

                let formStyleSet = parent.data.formStyleSet;
                let title = parent.data.formTitle;
                let status = parent.data.beginSetDesc;
                this.setData({
                    title,
                    status,
                    ...formStyleSet
                });
            }
        }
    }
});