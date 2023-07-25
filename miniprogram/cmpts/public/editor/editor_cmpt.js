import { showNoneToast } from '../../../utils/toast';
import { showModal } from '../../../utils/confirm';
import { arraySwap, arrayTop, arrayBottom } from '../../../utils/data';
import { imgTypeCheck, imgSizeCheck } from '../../../utils/image';
import { dataset } from '../../../utils/util';
import { anchor } from '../../../utils/page';

Component({
	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		nodeList: { // [{type:'text/img',val:'txt/cloudId'}]
			type: Array,
			value: [{
				type: 'text',
				val: ''
			}]
		},
		viewMode: {
			type: Boolean,
			value: false,
		},
		isView: {
			type: Boolean,
			value: false,
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		cur: -1,
	},

	lifetimes: {
		attached: function () {},

		ready: function () {

		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
        bindView() {
            this.setData({
                isView: !this.data.isView
            });
        },
		bindPreview(e) {
            let url = e.currentTarget.dataset.url;
            if (url.indexOf('qlogo') > -1) { //微信大图
                url = url.replace('/132', '/0');
            }
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: [url]
            });
		},
		setGlow(cur) {
			this.setData({
				cur
			});
			setTimeout(() => {
				this.setData({
					cur: -1
				});
			}, 1000);
		},
		bindAddTextTap: function (e) {
			let idx = dataset(e, 'idx');
			let node = {
				type: 'text',
				val: ''
			}
			let nodeList = this.data.nodeList;
			nodeList.splice(idx + 1, 0, node);
			this.setData({
				nodeList
			});

			this.setGlow(idx + 1);
		},
		bindAddImageTap: function (e) {
			let idx = dataset(e, 'idx');
			let that = this;
			wx.chooseMedia({
                count: 1,
                mediaType: ['image'],
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success(res) {
					let path = res.tempFiles[0].tempFilePath;
					let size = res.tempFiles[0].size;

					if (!imgTypeCheck(path)) {
						wx.hideLoading();
						return showNoneToast('只能上传png、jpg、jpeg格式', 3000);
					}

					let maxSize = 10; //TODO setting
					let imageMaxSize = 1024 * 1000 * maxSize;
					console.log('IMGX SIZE=' + size + 'Byte,' + size / 1024 + 'K');
					if (!imgSizeCheck(size, imageMaxSize)) {
						wx.hideLoading();
						return showModal('图片大小不能超过 ' + maxSize + '兆');
					}

					let node = {
						type: 'img',
						val: path
					};
					let nodeList = that.data.nodeList;
					nodeList.splice(idx + 1, 0, node);
					that.setData({
						nodeList
					});
					that.setGlow(idx + 1);
				}
			})
		},

		bidnDeleteNodeTap: function (e) {
			let idx = dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			if (this.data.nodeList.length == 1) return showNoneToast('至少需要一个内容框');
			nodeList.splice(idx, 1);
			this.setData({
				nodeList
			});
		},
		bindUpTap: function (e) {
			let idx = dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = arraySwap(nodeList, idx, idx - 1);
			this.setData({
				nodeList
			});
			anchor('editor-node-' + (idx - 1), this);
			this.setGlow(idx - 1);
		},
		bindTopTap: function (e) {
			let idx = dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = arrayTop(nodeList, idx);
			this.setData({
				nodeList
			});
			anchor('editor-node-0', this);
			this.setGlow(0);
		},
		bindBottomTap: function (e) {
			let idx = dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = arrayBottom(nodeList, idx);
			this.setData({
				nodeList
			});
			anchor('editor-node-' + (nodeList.length - 1), this);
			this.setGlow(nodeList.length - 1);
		},
		bindDownTap: function (e) {
			let idx = dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = arraySwap(nodeList, idx, idx + 1);
			this.setData({
				nodeList
			});
			anchor('editor-node-' + (idx + 1), this);
			this.setGlow(idx + 1);
		},

		bindTextareaInput: function (e) {
			let idx = dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			let node = nodeList[idx];
			if (node.type == 'text') {
				node.val = e.detail.value;
				nodeList[idx] = node;
				this.setData({
					nodeList
				});
			}
		},
		getNodeList: function (e) {
			return this.data.nodeList;
		},
	}
})