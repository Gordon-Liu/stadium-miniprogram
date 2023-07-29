// pages/admin/stadium/time/time.js
import AdminToken from '../../../../utils/admin-token';
import { loginExpirationConfirm, showModal, showConfirm } from '../../../../utils/confirm';
import { showSuccessToast, showNoneToast } from '../../../../utils/toast';
import { getPrevPage } from '../../../../utils/page';
import { time, fmtDateCHN, week } from '../../../../utils/time';
import { dataset } from '../../../../utils/util';
import { getArrByKey } from '../../../../utils/data';
import AdminStadiumApi from '../../../../apis/admin/stadium';
import { ApiCode } from '../../../../apis/cloud';
import AdminTempApi from '../../../../apis/admin/temp';
import { STADIUM_CAN_NULL_TIME } from '../../../../settings/setting';
import timeBehavior from '../../../../behaviors/time';

function getDaysTimeOptions() {
    let HourArr = [];
    let clockArr = [];
    let k = 0;

    for (k = 0; k <= 23; k++) {
        let node = {};
        node.label = k + '点';
        node.val = k < 10 ? '0' + k : k;
        HourArr.push(node);
    }

    for (k = 0; k < 59;) {
        let node = {};
        node.label = k + '分';
        node.val = k < 10 ? '0' + k : k;
        clockArr.push(node);
        k += 5;

        if (k == 60) {
            node = {};
            node.label = '59分';
            node.val = '59';
            clockArr.push(node);
        }
    }

    return [HourArr, clockArr];
}
// 判断含有预约的日期
function checkHasJoinCnt (times) {
    if (!times) return false;
    for (let k in times) {
        if (times[k].stat.succCnt || times[k].stat.waitCheckCnt) return true;
    }
    return false;
}

Component({
    behaviors: [timeBehavior],
    data: {
        daysTimeOptions: getDaysTimeOptions(),

		multiDoDay: [], //当前选择

		hasDays: [], //超时有数据(simple)
		lastHasDays: [], //超时有数据(full)
		hasJoinDays: [], //未超时有预约

		days: [
            /*{
                day: '2021-12-11',
                dayDesc: '12月11日 (周五)', 
                times: [{ 
                    mark: '',
                    start: '10:15', //开始
                    end: '23:59', // 结束
                    limit: 50, //人数限制
                    isLimit: false,
                }]
            }, {
                day: '2022-01-11',
                dayDesc: '1月11日 (周日)', 
                times: [{ 
                    mark: '',
                    start: '00:00', //开始
                    end: '23:59', // 结束
                    limit: 89, //人数限制
                    isLimit: true
                }]
            }*/
		],

		curIdx: -1, // 当前操作的日子索引
		curTimesIdx: -1, // 当前操作的时段索引

		curTimeLimitModalShow: false,
		curTimeIsLimit: false, // 当前操作是否限制人数
		curTimeLimit: 50, // 当前时段人数限制

		saveTempModalShow: false,
		formTempName: '',

		cancelModalShow: false, //删除对话框 
		formReason: '', //取消理由 
    },
    methods: {
        bindSetHasJoinDays () {
            let days = this.data.days;
            let now = time('Y-M-D');
            let hasJoinDays = [];
    
            for (let k in days) {
                if (days[k].day < now)
                    continue;
                else {
                    if (checkHasJoinCnt(days[k].times))
                        hasJoinDays.push(days[k].day);
                }
            }
            this.setData({
                hasJoinDays
            });
        },
        bindSyncCalData (e) { // 同步日历选中 
            let days = this.data.days;
            let multiDoDay = getArrByKey(days, 'day');
            this.setData({
                multiDoDay,
            });
        },
        bindTimeAdd (e) {
            let idx = dataset(e, 'idx');
            let days = this.data.days;
    
            if (days[idx].times.length >= 20) return showModal('最多可以添加20个时段');
    
            days[idx].times.push(this.getNewTimeNode(days[idx].day));
    
            this.setData({
                days
            });
        },
        async bindCancelMeetJoinCmpt (e) { //取消已有预约
            const curIdx = this.data.curIdx;
            const curTimesIdx = this.data.curTimesIdx;
            const days = this.data.days;
    
            const parent = getPrevPage(2);
            if (!parent) return;

            const res = await AdminStadiumApi.cancelTime(
                parent.data.id,
                this.data.formReason,
                days[curIdx].times[curTimesIdx].mark
            );

            if (res.code === ApiCode.SUCCESS) {
                const callback = () => {
                    days[curIdx].times.splice(curTimesIdx, 1);
                    this.setData({
                        days,
                        cancelModalShow: false,
                        formReason: ''
                    });
                    this.bindSetHasJoinDays();
                }
                showSuccessToast('取消成功', 1500, callback);
            }
        },
    
        bindTimeDel (e) {
            const idx = dataset(e, 'idx');
            const timesIdx = dataset(e, 'timesidx');
            const days = this.data.days;
            const node = days[idx].times[timesIdx];
    
            if (node.stat.succCnt || node.stat.waitCheckCnt) {
                const callback = async () => {
                    this.setData({
                        formReason: '',
                        curIdx: idx,
                        curTimesIdx: timesIdx,
                        cancelModalShow: true //显示对话框
                    });
                };
                showConfirm('该时段已有「' + (node.stat.succCnt + node.stat.waitCheckCnt) + '人」预约/预约待审核，若选择删除则将取消所有预约，请仔细确认！ 若不想取消，可以选择停止该时段', callback);
            } else {
                const callback = () => {
                    days[idx].times.splice(timesIdx, 1);
                    this.setData({
                        days
                    });
                };
                showConfirm('是否要删除该时间段？', callback);
            }
        },
    
        bindTimeStatusSwitch (e) {
            const idx = dataset(e, 'idx');
            const timesIdx = dataset(e, 'timesidx');
            const days = this.data.days;
            const status = days[idx].times[timesIdx].status;
    
            if (status == 0) {
                days[idx].times[timesIdx].status = 1;
                this.setData({
                    days
                });
            } else {
                const yes = () => {
                    days[idx].times[timesIdx].status = 0;
                    this.setData({
                        days
                    });
                };
                showConfirm('是否要停止该时间段的预约？停止后，已有预约记录仍将保留', yes);
            }
    
        },
    
        bindDaysTimeStartCmpt (e) {
            const start = e.detail.join(':');
            const idx = dataset(e, 'idx');
            const timesIdx = dataset(e, 'timesidx');
    
            const days = this.data.days;
    
            const end = days[idx].times[timesIdx].end;
            if (start >= end) return showModal('开始时间不能大于等于结束时间');
    
            days[idx].times[timesIdx].start = start;
            this.setData({
                days
            });
        },
    
        bindDaysTimeEndCmpt (e) {
            const end = e.detail.join(':');
            const idx = dataset(e, 'idx');
            const timesIdx = dataset(e, 'timesidx');
    
            const days = this.data.days;
    
            const start = days[idx].times[timesIdx].start;
            if (start >= end) return showModal('开始时间不能大于等于结束时间');
    
            days[idx].times[timesIdx].end = end;
            this.setData({
                days
            });
        },
        bindSwitchModel (e) {
            this.setData({
                curTimeIsLimit: (e.detail.value) ? true : false
            });
        },
        async bindSaveTempCmpt (e) {
            const name = this.data.formTempName;
            if (name.length <= 0) return showNoneToast('请填写模板名称');
            if (name.length > 20) return showNoneToast('模板名称不能超过20个字哦');

            const days = this.data.days;
            const times = days[this.data.curIdx].times;
            if (times.length <= 0) return showNoneToast('至少需要包含一个时段');
            if (times.length > 20) return showNoneToast('时段不能超过20个');

            const temps = [];
            for (let k in times) {
                const node = {};
                node.start = times[k].start;
                node.end = times[k].end;
                node.isLimit = times[k].isLimit;
                node.limit = times[k].limit;
                temps.push(node);
            }

            const res = await AdminTempApi.insert(
                name,
                temps
            );
            if (res.code === ApiCode.SUCCESS) {
                showSuccessToast('保存成功');
                this.setData({
                    saveTempModalShow: false,
                    formTempName: '',
                });
            }
        },

        bindTimeLimitSetCmpt (e) {
            const days = this.data.days;
            const idx = this.data.curIdx;
            const timesIdx = this.data.curTimesIdx;

            if (this.data.curTimesIdx == -1) {
                // 全天
                for (let k in days[idx].times) {
                    days[idx].times[k].isLimit = this.data.curTimeIsLimit;
                    days[idx].times[k].limit = this.data.curTimeLimit;
                }
            } else {

                // 某时间段
                let node = days[idx].times[timesIdx];
                node.isLimit = this.data.curTimeIsLimit;
                node.limit = this.data.curTimeLimit;
                days[idx].times[timesIdx] = node;
            }

            this.setData({
                days,
                curTimeLimitModalShow: false
            });
        },

        async bindShowTimeLimitModal (e) {
            const curIdx = dataset(e, 'idx');
            const curTimesIdx = dataset(e, 'timesidx');

            const days = this.data.days;

            if (curTimesIdx == -1) {
                // 全天
                this.setData({
                    curIdx,
                    curTimesIdx: -1,
                    curTimeIsLimit: false,
                    curTimeLimit: 50,
                    curTimeLimitModalShow: true
                });
            } else {
                // 时间段
                const node = days[curIdx].times[curTimesIdx];
                const curTimeIsLimit = node.isLimit;
                const curTimeLimit = node.limit;
                this.setData({
                    curIdx,
                    curTimesIdx,
                    curTimeIsLimit,
                    curTimeLimit,
                    curTimeLimitModalShow: true
                });
            }
        },
        bindSelectTemp (e) {
            const curIdx = dataset(e, 'idx');
    
            if (checkHasJoinCnt(this.data.days[curIdx].times)) {
                return showModal('该日已有用户预约/预约待审核，不能选用模板。若确定要选用模板，请先删除有预约的时段');
            }
    
            this.setData({
                curIdx
            });
            
            wx.navigateTo({
                url: '/pages/admin/stadium/temp/temp',
            });
        },
        bindSaveTempModal (e) {
            const curIdx = dataset(e, 'idx');
            const days = this.data.days;
            if (days[curIdx].times.length <= 0) return showModal('该日期下没有设置时段，无法保存为模板，请先添加时段');
            this.setData({
                saveTempModalShow: true,
                curIdx
            });
        },
        bindCopyDaySetToAll (e) { //  复制到所有
            const curIdx = dataset(e, 'idx');
            const days = this.data.days;
            const day = days[curIdx].day;
            const temps = days[curIdx].times;
    
            const callback = () => {
                for (let k in days) {
                    if (checkHasJoinCnt(days[k].times)) continue; //自己和有记录不复制
    
                    const times = [];
                    for (let j in temps) {
                        const node = this.getNewTimeNode(days[k].day);
                        node.start = temps[j].start;
                        node.end = temps[j].end;
                        node.limit = temps[j].limit;
                        node.isLimit = temps[j].isLimit;
                        times.push(node);
                    }
                    days[k].times = times;
                }
                this.setData({
                    days
                });
            }
    
            showConfirm('确认将「' + day + '」下的时段设置复制到其他日期下吗? (原有时段将被清除，如已有预约记录则该日的所有时段将不被修改)', callback);
        },
        async bindDaySet (e) {
            const itemList = ['选用模板配置', '保存为模板', '删除该日期', '复制到所有日期'];
            wx.showActionSheet({
                itemList,
                success: async res => {
                    const idx = res.tapIndex;
                    if (idx == 0) { // 选用模板配置
                        this.bindSelectTemp(e);
                    }
                    if (idx == 1) { // 保存为模板 
                        this.bindSaveTempModal(e);
                    }
                    if (idx == 2) { //  删除
                        const curIdx = dataset(e, 'idx');
                        if (checkHasJoinCnt(this.data.days[curIdx].times)) {
                            return showModal('该日已有用户预约/预约待审核，不能直接删除。若确定要删除，请先删除有预约的时段')
                        }
                        const callback = () => {
                            let days = this.data.days;
                            days.splice(curIdx, 1);
                            this.setData({
                                days
                            });
                            this.bindSyncCalData();
                        }
                        showConfirm('确认删除该日期吗?', callback);
                    }
    
                    if (idx == 3) { //复制到所有
                        this.bindCopyDaySetToAll(e);
                    }
                },
                fail: function (res) {}
            })
        },
    
        async bindTimeSet (e) {
            let itemList = ['复制到所有日期', '选用模板配置', '保存为模板'];
            wx.showActionSheet({
                itemList,
                success: async res => {
                    const idx = res.tapIndex;
                    if (idx == 0) { // 复制到所有
                        this.bindCopyDaySetToAll(e);
                    }
                    if (idx == 1) { // 选用模板配置
                        this.bindSelectTemp(e);
                    }
                    if (idx == 2) { // 保存为模板 
                        this.bindSaveTempModal(e);
                    }
    
                },
                fail: function (res) {}
            })
        },
    
        bindDataCalendarClickCmpt (e) {
            // 数据日历点击
            const clickDays = e.detail.days;
            if (!clickDays) return;
            const days = this.data.days;
    
            const retDays = [];
            for (let k in clickDays) {
                let dayExist = false;
                for (let j in days) {
                    if (days[j].day == clickDays[k]) {
                        // 节点存在
                        retDays.push(days[j]);
                        dayExist = true;
                        break;
                    };
                }
    
                // 节点不存在
                if (!dayExist) {
                    const dayDesc = fmtDateCHN(clickDays[k]) + ' (' + week(clickDays[k]) + ')';
                    const times = [this.getNewTimeNode(clickDays[k])];
                    const node = {
                        day: clickDays[k],
                        dayDesc,
                        times
                    };
                    retDays.push(node);
                }
    
            }
            
            this.setData({
                days: retDays
            });
        },
        bindClearReason (e) {
            this.setData({
                formReason: ''
            })
        },
    
        bindTop () {
            wx.pageScrollTo({
                scrollTop: 0
            })
        },
        bindBack() {
            wx.navigateBack({
                delta: 0,
            });
        },
        bindSave() {
            const parent = getPrevPage(2);
            if (!parent) {
                showNoneToast('前序页面不存在');
                return;
            }

            const days = this.data.days;
            const getDays = [];
            if (!STADIUM_CAN_NULL_TIME) { // 是否允许无时段日期
                for (let k in days) {
                    if (days[k].times.length > 0) getDays.push(days[k]);
                }
            } else
                getDays = days;


            let formDaysSet = this.data.lastHasDays.concat(getDays);
            parent.setData({
                formDaysSet
            });

            wx.navigateBack({
                delta: 0,
            });
        },
        onPageScroll (e) {
            if (e.scrollTop > 100) {
                this.setData({
                    topShow: true
                });
            } else {
                this.setData({
                    topShow: false
                });
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
                });
                const parent = getPrevPage(2);
                if (parent) {
                    const formDaysSet = parent.data.formDaysSet;
                    const days = [];
                    const lastHasDays = [];
                    const hasJoinDays = [];
                    const now = time('Y-M-D');

                    for (let k in formDaysSet) { //已超时无法编辑, 有数据显示form
                        if (formDaysSet[k].day < now)
                            lastHasDays.push(formDaysSet[k]);
                        else {
                            days.push(formDaysSet[k]);
                            if (checkHasJoinCnt(formDaysSet[k].times)) {
                                hasJoinDays.push(formDaysSet[k].day);
                            }   
                        }
        
                    }
                    this.setData({
                        hasDays: getArrByKey(lastHasDays, 'day'),
                        lastHasDays,
                        hasJoinDays,
                        days
                    });
                    this.bindSyncCalData();
                }
            }
        }
    }
});