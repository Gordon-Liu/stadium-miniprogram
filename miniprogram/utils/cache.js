import { isDefined } from './util';

const TIME_SUFFIX = "_deadtime"

/**
 * 设置
 * k 键key
 * v 值value
 * t 秒
 */
export function set(k, v, t = 86400 * 30) {
	if (!k) return null;

	wx.setStorageSync(k, v);
	let seconds = parseInt(t);
	if (seconds > 0) {
		let newtime = Date.parse(new Date());
		newtime = newtime / 1000 + seconds;
		wx.setStorageSync(k + TIME_SUFFIX, newtime + "");
	} else {
		wx.removeStorageSync(k + TIME_SUFFIX);
	}
}
 

/**
 * 获取
 * k 键key
 * def 默认值
 */
export function get(k, def = null) {
	if (!k) return null;

	let deadtime = wx.getStorageSync(k + TIME_SUFFIX); 
	if (!deadtime) return def;
 
	deadtime = parseInt(deadtime); 
	if (!deadtime) return def;
	
	if (deadtime) {
		if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
			wx.removeStorageSync(k); 
			wx.removeStorageSync(k + TIME_SUFFIX); 
			return def;
		}
	} 

	let res = wx.getStorageSync(k);
 
	if (isDefined(res)) {
		return res;
	} else {
		return def;
	}
}

/**
 * 删除
 */
export function remove(k) {
	if (!k) return null;
	
	wx.removeStorageSync(k);
	wx.removeStorageSync(k + TIME_SUFFIX);
}

/**
 * 清除所有key
 */
export function clear() {
	wx.clearStorageSync();
}