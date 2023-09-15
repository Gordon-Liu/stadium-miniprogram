const cloud = require('wx-server-sdk');
const Service = require('../framework/service.js');
const ExportModel = require('../models/export.js');
const timeUtil = require('../framework/time-util.js');
const cloudUtil = require('../framework/cache-util.js');
const md5Lib = require('../framework/lib/md5.js');
const config = require('../config.js');

cloud.init({
    env: config.CLOUD_ID
});

class DataService extends Service {

	// 获得当前导出链接
	async getExportDataURL(key) {
		// 取出数据
		const whereExport = {
			export_key: key
		}

		let url = '';
		let time = '';
		let expData = await ExportModel.getOne(whereExport, 'export_cloud_id, export_edit_time');
		if (!expData)
			url = '';
		else {
			url = expData.export_cloud_id;
			url = await cloudUtil.getTempFileURLOne(url) + '?rd=' + this._timestamp;
			time = timeUtil.timestamp2Time(expData.EXPORT_EDIT_TIME);
		}

		return {
			url,
			time
		}
	}

	// 删除数据文件
	async deleteDataExcel(key) {
		console.log('[deleteExcel]  BEGIN... , key=' + key)

		// 取出数据
		const whereExport = {
			export_key: key
		}
		let expData = await ExportModel.getOne(whereExport);
		if (!expData) return;

		// 文件路径
		let xlsPath = expData.export_cloud_id;

		console.log('[deleteExcel]  path = ' + xlsPath);

		await cloud.deleteFile({
			fileList: [xlsPath],
		}).then(async res => {
			console.log(res.fileList);
			if (res.fileList && res.fileList[0] && res.fileList[0].status == -503003) {
				console.log('[deleteUserExcel]  ERROR = ', res.fileList[0].status + ' >> ' + res.fileList[0].errMsg);
				this.AppError('文件不存在或者已经删除');
			}

			// 删除导出表 
			await ExportModel.del(whereExport);

			console.log('[deleteExcel]  OVER.');

		}).catch(error => {
			if (error.name != 'AppError') {
				console.log('[deleteExcel]  ERROR = ', error);
				this.AppError('操作失败，请重新删除');
			} else
				throw error;
		});


	}

	// 导出数据  
	async exportDataExcel(key, title, total, data, options = {}) {
		// 删除导出表
		let whereExport = {
			export_cloud_id: key
		}
		await ExportModel.del(whereExport);

		let fileName = key + '_' + md5Lib.md5(key + config.CLOUD_ID + this.getProjectId());
		let xlsPath = config.DATA_EXPORT_PATH + fileName + '.xlsx';

		// 操作excel用的类库
		const xlsx = require('node-xlsx');

		// 把数据保存到excel里
		let buffer = await xlsx.build([{
			name: title + timeUtil.timestamp2Time(this._timestamp, 'Y-M-D'),
			data,
			options
		}]);

		// 把excel文件保存到云存储里
		console.log('[ExportData]  Save to ' + xlsPath);
		let upload = await cloud.uploadFile({
			cloudPath: xlsPath,
			fileContent: buffer, //excel二进制文件
		});
		if (!upload || !upload.fileID) return;

		// 入导出表 
		let dataExport = {
			export_key: key,
			export_cloud_id: upload.fileID
		}
		await ExportModel.insert(dataExport);

		console.log('[ExportData]  OVER.')

		return {
			total
		}
	}
}

module.exports = DataService;