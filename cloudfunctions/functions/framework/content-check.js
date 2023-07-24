const cloud = require('wx-server-sdk');
const config = require('../config.js');
const AppError = require('./app-error.js'); 

cloud.init({
    env: config.CLOUD_ID
});

/**
 * 前台校验
 * @param {*} imgData 
 * @param {*} mine 
 */
async function checkImgClient(imgData, mine) {
	return await checkImg(imgData,mine);
}

/**
 * 后台校验
 * @param {*} imgData 
 * @param {*} mine 
 */
async function checkImgAdmin(imgData, mine) {
	return await checkImg(imgData,mine);
}
/**
 * 校验图片信息
 * @param {*} 图片流buffer 
 */
async function checkImg(imgData, mine) {


	let cloud = cloudBase.getCloud();
	try {
		const result = await cloud.openapi.security.imgSecCheck({
			media: { 
				contentType: 'image/' + mine,
				value: Buffer.from(imgData, 'base64') // 这里必须要将小程序端传过来的进行Buffer转化,否则就会报错,接口异常
			}

		})
		console.log('imgcheck', result);
		if (!result || result.errCode !== 0) {
			throw new AppError('图片内容不合适，请修改');
		}

	} catch (err) {
		console.log('imgcheck ex', err);
		throw new AppError('图片内容不合适，请修改');
	}

}

/**
 * 后台把输入数据里的文本数据提交内容审核
 * @param {*} input 
 */
async function checkTextMultiAdmin(input) { 
	return checkTextMulti(input);
}

/**
 * 前台把输入数据里的文本数据提交内容审核
 * @param {*} input 
 */
async function checkTextMultiClient(input) { 
	return checkTextMulti(input);
}

/**
 * 把输入数据里的文本数据提交内容审核
 * @param {*} input 
 */
async function checkTextMulti(input) {

	let txt = '';
	for (let k in input) {
		if (typeof (input[k]) === 'string')
			txt += input[k];
	} 
	await checkText(txt);
}
/**
 * 后台校验文字信息
 * @param {*}  
 */
async function checkTextAdmin(txt) {
	return checkText(txt);
}

/**
 * 前台校验文字信息
 * @param {*}  
 */
async function checkTextClient(txt) {
	return checkText(txt);
}

/**
 * 校验文字信息
 * @param {*}  
 */
async function checkText(txt) {
	
	
	if (!txt) return;

	let cloud = cloudBase.getCloud();
	try {
		const result = await cloud.openapi.security.msgSecCheck({
			content: txt

		})
		// console.log('checkText', result);
		if (!result || result.errCode !== 0) {
			throw new AppError('文字内容不合适，请修改或者重试');
		}

	} catch (err) {
		console.log('checkText ex', err);
		throw new AppError('文字内容不合适，请修改或者重试');
	}

}

module.exports = {
	checkImg,
	checkImgClient,
	checkImgAdmin,
	checkTextMulti,
	checkTextMultiClient,
	checkTextMultiAdmin,
	checkText,
	checkTextClient,
	checkTextAdmin
}