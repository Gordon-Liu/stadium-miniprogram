import { fmtText } from '../utils/data';
import { showModal } from '../utils/confirm';
import { AdminClient } from '../apis/cloud';
import { STADIUM_PIC_PATH } from '../settings/setting';
import { defaultForm } from '../cmpts/public/form/form_set_helper';

function getBeginDaySetOptions() {
    let dayArr = [];
    let clockArr = [];
    let k = 0;

    let nodeCur = {};
    nodeCur.label = '当天';
    nodeCur.val = 0;
    dayArr.push(nodeCur);

    for (k = 1; k <= 180; k++) {
        let node = {};
        node.label = '提前' + k + '天';
        node.val = k;
        dayArr.push(node);
    }

    for (k = 0; k < 24; k++) {
        let node = {};
        node.label = k + '点00分' + '开始';
        node.val = (k < 10 ? '0' + k : k) + ':00';
        clockArr.push(node);

        node = {};
        node.label = k + '点30分' + '开始';
        node.val = (k < 10 ? '0' + k : k) + ':30';
        clockArr.push(node);

    }

    return [dayArr, clockArr];

}

export default Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {
        typeIdOptions: [{
            label: '羽毛球场预约',
            val: '1'
        }, {
            label: '足球场预约',
            val: '2'
        }, {
            label: '篮球场预约',
            val: '3'
        }, {
            label: '乒乓球预约',
            val: '4'
        }, {
            label: '网球场预约',
            val: '5'
        }, {
            label: '游泳馆预约',
            val: '6'
        }, {
            label: '健身房预约',
            val: '7'
        }],
        beginDaySetOptions: getBeginDaySetOptions(),

        // 表单数据  
        formTitle: '',
        formTypeId: '',
        formContent: '',
        formOrder: 9999,
        formStyleSet: {
            pic: '',
            desc: ''
        },

        formDaysSet: [], // 时间设置 


        formIsShowLimit: 1, //是否显示可预约数量

        formFormSet: defaultForm(),

        CHECK_FORM: {
            title: 'formTitle|must|string|min:2|max:50|name=标题',
            typeId: 'formTypeId|must|id|name=分类',
            order: 'formOrder|must|int|min:1|max:9999|name=排序号',
        
            daysSet: 'formDaysSet|must|array|name=预约时间设置',
            isShowLimit: 'formIsShowLimit|must|int|in:0,1|name=是否显示可预约人数',
        
            formSet: 'formFormSet|must|array|name=用户资料设置',
        }
	},
	methods: {
        bindSetContentDesc() {
            let contentDesc = '未填写';
            let content = this.data.formContent;
            let imgCnt = 0;
            let textCnt = 0;
            for (let k in content) {
                if (content[k].type == 'img') imgCnt++;
                if (content[k].type == 'text') textCnt++;
            }

            if (imgCnt || textCnt) {
                contentDesc = textCnt + '段文字，' + imgCnt + '张图片';
            }
            this.setData({
                contentDesc
            });
        },
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        bindFormClearFocus() {
            let data = this.data;
            let focus = {};
            for (let key in data) {
                if (key.startsWith('form') && !key.endsWith('Focus'))
                    focus[key + 'Focus'] = null;
            }
            this.setData({
                ...focus
            });
        },
        bindFormHint(formName, hint) {
            this.setData({
                [formName + 'Focus']: hint
            });
            return showModal(hint);
        },
        async bindUpdateMeetCotnentPic(content) {
            let imgList = [];
            for (let k in content) {
                if (content[k].type == 'img') {
                    imgList.push(content[k].val);
                }
            }
    
            // 图片上传到云空间
            const adminClient = new AdminClient();
            imgList = await adminClient.uploadImage(imgList, STADIUM_PIC_PATH);
    
            // 更新图片地址
            let imgIdx = 0;
            for (let k in content) {
                if (content[k].type == 'img') {
                    content[k].val = imgList[imgIdx];
                    imgIdx++;
                }
            }
    
            // 更新本记录的图片信息
            this.setData({
                formContent: content
            });
        },
        async bindUpdateMeetStyleSet(styleSet) {
            let pic = styleSet.pic;
    
            // 图片上传到云空间
            if (styleSet.pic) { 
                const adminClient = new AdminClient();
                const imgList = await adminClient.uploadImage([pic], STADIUM_PIC_PATH);
                styleSet.pic = imgList[0];
            }
                
            // 更新本记录的图片信息
            this.setData({
                formStyleSet: styleSet
            });
        },
        getTypeName() {
            for (let k in this.data.typeIdOptions) {
                if (this.data.typeIdOptions[k].val == this.data.formTypeId) return this.data.typeIdOptions[k].label;
            }
            return '';
        },
	}
});