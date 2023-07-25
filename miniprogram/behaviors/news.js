import { fmtText } from '../utils/data';

export default Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {
        id: '',

        contentDesc: '',
        // 分类
        cateIdOptions: [{
            label: '场馆动态',
            val: '1'
        }, {
            label: '运动常识',
            val: '2'
        }],

        // 图片数据 
        imgList: [],


        // 表单数据 
        formType: 0, //类型 
        formOrder: 9999,
        formTitle: '',
        formDesc: '',
        formUrl: '',
        formContent: [],
        formCateId: '',
        /** 表单校验  本地 */
        CHECK_FORM: {
            title: 'formTitle|must|string|min:4|max:50|name=标题',
            cateId: 'formCateId|must|id|name=分类',
            order: 'formOrder|must|int|min:1|max:9999|name=排序号',
            desc: 'formDesc|string|min:10|max:200|name=简介',
            type: 'formType|must|int|in:0,1|name=是否外部文章'
        },
        /** 表单校验  外部 */
        CHECK_FORM_OUT: {
            title: 'formTitle|must|string|min:4|max:50|name=标题',
            cateId: 'formCateId|must|id|name=分类',
            order: 'formOrder|must|int|min:1|max:9999|name=排序号',
            desc: 'formDesc|string|min:10|max:200|name=简介',
            type: 'formType|must|int|in:0,1|name=是否外部文章',
            url: 'formUrl|must|string|min:10|max:300|name=外部链接地址',
        }
	},
	methods: {
        bindSelectCate(e) {
 			this.setData({
                formCateId: e.detail
 			});
        },
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
         /**
         * 配合搜索列表响应监听
         * @param {*} that 
         */
        bindCommListListener(e) {
            if (isDefined(e.detail.search))
                this.setData({
                    search: '',
                    sortType: '',
                });
            else {
                this.setData({
                    dataList: e.detail.dataList,
                });
                if (e.detail.sortType)
                    this.setData({
                        sortType: e.detail.sortType,
                    });
            }
        },
        bindJumpUrl (e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });
        },
        bindSwitchModel (e) {
            const value = (e.detail.value) ? 1 : 0;
            this.setData({
                formType: value
 			});
        },
        bindImgUploadCmpt (e) {
            this.setData({
                imgList: e.detail
            });
        },
        getCateName() {
            for (let k in this.data.cateIdOptions) {
                if (this.data.cateIdOptions[k].val == this.data.formCateId) return this.data.cateIdOptions[k].label;
            }
            return '';
        },
        // 提取简介
        getDesc() {
            if (this.data.desc) return fmtText(this.data.desc, 100);
            if (!Array.isArray(this.data.formContent)) return desc;

            for (let k in this.data.formContent) {
                if (this.data.formContent[k].type == 'text') return fmtText(this.data.formContent[k].val, 100);
            }
            return this.data.desc;
        }
	}
});