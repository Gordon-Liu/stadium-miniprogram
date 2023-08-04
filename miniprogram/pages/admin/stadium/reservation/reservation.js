// pages/admin/stadium/reservation/reservation.js
import AdminToken from '../../../../utils/admin-token';
import behavior from '../../../../cmpts/behavior/list';
import { loginExpirationConfirm } from '../../../../utils/confirm';

Component({
    behaviors: [behavior],
    properties: {
        stadiumId: String,
        title: String,
        mark: String,
        dayidx: String,
        timeidx: String,
        time: String,
    },
    data: {
        isLoad: false,
		isAllFold: true,

		parentDayIdx: 0,
		parentTimeIdx: 0,

		menuIdx: 0,

		titleEn: '',

		cancelModalShow: false,
		cancelAllModalShow: false,
		refuseModalShow: false,
		formReason: '',
		curIdx: -1
    },
    methods: {
        // 修改与展示状态菜单
        getSearchMenu () {

            let sortItems = [];
            let sortMenus = [{
                    label: '全部',
                    type: '',
                    value: ''
                }, {
                    label: `成功`,
                    type: 'status',
                    value: 1
                }, 
                
                {
                    label: `已取消`,
                    type: 'status',
                    value: 1099
                }, 
                {
                    label: `已签到`,
                    type: 'checkin',
                    value: 1
                },
                {
                    label: `未签到`,
                    type: 'checkin',
                    value: 0
                }

            ]
            this.setData({
                sortItems,
                sortMenus
            })

        },
    },
    lifetimes: {
        attached() {
            const options = null;
            const admin = AdminToken.getAdmin();
            if (!admin) {
                loginExpirationConfirm();
            } else {
                // 附加参数 
                if (this.data.stadiumId && this.data.mark) {
                    //设置搜索菜单 
                    this.getSearchMenu();

                    this.setData({
                        isAdmin: true,
                        _params: {
                            stadiumId: this.data.stadiumId,
                            mark: this.data.mark,
                        }
                    }, () => (
                        this.setData({
                            isLoad: true
                        })
                    ));
                }

                if (this.data.title) {
                    const title = decodeURIComponent(this.data.title);
                    this.setData({
                        title,
                        titleEn: this.data.title
                    });
                    wx.setNavigationBarTitle({
                        title: '分时段预约名单 - ' + title
                    });
                }
            }
        }
    }
})