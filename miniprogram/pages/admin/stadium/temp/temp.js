// pages/admin/stadium/temp/temp.js
import AdminToken from '../../../../utils/admin-token';
import { dataset } from '../../../../utils/util';
import { getPrevPage } from '../../../../utils/page';
import { showConfirm } from '../../../../utils/confirm';
import { showSuccessToast } from '../../../../utils/toast';
import AdminTempApi from '../../../../apis/admin/temp';
import { ApiCode } from '../../../../apis/cloud';
import timeBehavior from '../../../../behaviors/time';

Component({
    behaviors: [timeBehavior],
    data: {
        isAdmin: false,
        isLoad: false,

		temps: [],

		curIdx: -1,

		curTimeModalShow: false,
		curTimeIsLimit: false, // 当前操作是否限制人数
		curTimeLimit: 50, // 当前时段人数限制
    },
    methods: {
        bindSwitchModel (e) {

            this.setData({
                curTimeIsLimit: (e.detail.value) ? true : false
            })
        },
        async bindAllLimitSetCmpt (e) {
            if (this.data.curIdx <= -1) return;
            const temp = this.data.temps[this.data.curIdx];

            const res = await AdminTempApi.edit(
                temp.id,
                this.data.curTimeLimit,
                this.data.curTimeIsLimit
            );
            if (res.code == ApiCode.SUCCESS) {
                const times = [];
                for (let k in temp.times) {
                    times.push({
                        ...temp.times[k],
                        limit: this.data.curTimeLimit,
                        isLimit: this.data.curTimeIsLimit
                    });
                }
                temp.times = times;
                this.data.temps[this.data.curIdx] = temp;
                this.setData({
                    temps: this.data.temps,
                    curTimeModalShow: false,
                    curTimeIsLimit: false,
                    curTimeLimit: 50,
                });
                showSuccessToast('修改成功');
            }
        },
        bindSelect (e) {
            const curIdx = dataset(e, 'idx');
            const temps = this.data.temps[curIdx].times;
            const name = this.data.temps[curIdx].name;
    
            const parent = getPrevPage(2);
            if (!parent) return;
            let days = parent.data.days;
            const day = days[parent.data.curIdx].day;
    
            const callback = () => {
                let times = [];
                for (const k in temps) {
                    const node = this.getNewTimeNode(day);
                    node.start = temps[k].start;
                    node.end = temps[k].end;
                    node.limit = temps[k].limit;
                    node.isLimit = temps[k].isLimit;
                    times.push(node);
                }
                days[parent.data.curIdx].times = times;
                parent.setData({
                    days
                });
                wx.navigateBack({
                    delta: 0,
                });
            }
    
            showConfirm('确认要选用模板 「' + name + '」配置到日期 「' + day + '」下吗?', callback);
        },
        async bindDelTemp (curIdx, id) {
            const res = await AdminTempApi.delete(id);
            if (res.code == ApiCode.SUCCESS) {
                const temps = this.data.temps;
                temps.splice(curIdx, 1);
                this.setData({
                    temps
                });
            }
        },
        bindOpr (e) {
            const curIdx = dataset(e, 'idx');
    
            const itemList = ['删除模板', '批量设置人数上限'];
            wx.showActionSheet({
                itemList,
                success: async res => {
                    const idx = res.tapIndex;
                    if (idx == 0) { // 删除
                        const temps = this.data.temps;
                        const name = temps[curIdx].name;
                        const callback = () => {
                            this.bindDelTemp(curIdx, temps[curIdx].id);
                        }
    
                        showConfirm('确认要删除模板 「' + name + '」吗?', callback);
                    }
                    if (idx == 1) {
                        this.setData({
                            curIdx,
                            curTimeModalShow: true
                        });
                    }
    
    
                },
                fail: function (res) {}
            })
        },
        async getList() {
            const res = await AdminTempApi.list();
            if (res.code == ApiCode.SUCCESS) {
                this.setData({
					isLoad: res.data.length == 0 ? null : true,
					temps: res.data
				});
            }
        },
        async onPullDownRefresh () {
            await this.getList();
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
                    isAdmin: true
                });
                this.getList();
            }
        }
    }
});