import { isDefined } from './util';

export function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 毫秒时间戳转时间格式
 * @param {*} unixtime  毫秒
 * @param {*} format  Y-M-D h:m:s
 * @param {*} diff  时区差异 毫秒
 */
export function timestamp2Time(unixtime, format = 'Y-M-D h:m:s', diff = 0) {
	let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	let returnArr = [];
	let date = new Date(unixtime + diff);
	returnArr.push(date.getFullYear());
	returnArr.push(formatNumber(date.getMonth() + 1));
	returnArr.push(formatNumber(date.getDate()));
	returnArr.push(formatNumber(date.getHours()));
	returnArr.push(formatNumber(date.getMinutes()));
	returnArr.push(formatNumber(date.getSeconds()));
	for (let i in returnArr) {
		format = format.replace(formateArr[i], returnArr[i]);
	}
	return format;
}

/**
 *  获取当前时间戳/时间Y-M-D h:m:s
 * @param {*} 时间格式 Y-M-D h:m:s
 * @param {int} 时间步长 (秒)
 */
export function time(fmt, step = 0) {
	let t = 0;
	if (isDefined(fmt)) {
		let t = new Date().getTime() + step * 1000;
		return timestamp2Time(t, fmt);
	}
	return new Date().getTime() + t * 1000;
}