import { timestamp2Time, time2Timestamp } from '../../../utils/time';
import { padLeft, deepClone, arrAddDel } from '../../../utils/data';
import { sloarToLunar } from '../../../utils/lunar';

// 是否节日
export function isHoliday(day) {
	if (!day) return false;

	let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'];
	for (let k in arr) {
		if (day.includes(arr[k]))
			return false;
	}
	return true;
}

// 某天是某月的第几周
export function weekIndexInMonth(year = null, month = null, today = null) {
	let time = new Date();

	if (year == null) { // 没有设定，则取当前
		year = time.getFullYear();
		month = time.getMonth();
		today = time.getDate();
	} else {
		year = Number(year);
		month = Number(month) - 1;
		today = Number(today);
	}

	time = new Date(year, month, 1); //取第一天

	let space = time.getDay() - 1; //获取当前星期X(0-6,0代表星期天)  
	if (space == -1) space = 6; //调整为周1-周7格式 

	return Math.ceil((today + space) / 7); // 本月第几周

}

// 日期格式化，一位补2位
export function fmtDate(str) {
	str = str + '';
	if (str.length == 1)
		return '0' + str;
	else
		return str;
}

// 获取当前时间，若定义了要操作的天, 则取得年份和月份，用以构造日历
export function getNowTime(that) {
	const time = new Date();
	let year = time.getFullYear();
	let month = time.getMonth() + 1;
	let week = time.getDay();

	let today = time.getDate(); // 今天
	let fullToday = year + '-' + fmtDate(month) + '-' + fmtDate(today); // 今天完整格式

	// 若定义了要操作的天, 则取得年份和月份，用以构造日历
	if (that.data.mode == 'one' && that.data.oneDoDay) {
		year = Number(timestamp2Time(time2Timestamp(that.data.oneDoDay), 'Y'));
		month = Number(timestamp2Time(time2Timestamp(that.data.oneDoDay), 'M'));
	} else if (that.data.mode == 'multi' && that.data.multiDoDay && that.data.multiDoDay.length > 0 && that.data.multiDoDay[0]) {
		year = Number(timestamp2Time(time2Timestamp(that.data.multiDoDay[0]), 'Y'));
		month = Number(timestamp2Time(time2Timestamp(that.data.multiDoDay[0]), 'M'));
	}

	let oneDoDay = that.data.oneDoDay || fullToday; // 正在操作的天完整格式
	// let multiDoDay = that.data.multiDoDay || [oneDoDay];  // 多选默认选中一天
	let multiDoDay = that.data.multiDoDay;

	that.setData({
		year,
		month,

		fullToday,

		oneDoDay,
		multiDoDay,
		week
	});
}
//获得某月天数 
export function getMonthCnt(year, month) {
	let baseMonthsDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //各月天数
	if (month == 2 && year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))
		return 29;
	else
		return baseMonthsDay[month - 1];
}

//获得上月天数  
export function getLastMonthCnt(year, month) {
	if (month == 1) {
		month = 12;
		--year;
	} else
		--month;
	return getMonthCnt(year, month);
}

//从上月补几天
export function getLastMonthArr(that, year, month) {

	let time = new Date(year, month - 1, 1);
	let space = time.getDay() - 1; //获取当前星期X(0-6,0代表星期天)  
	if (space == -1) space = 6; //调整为周1-周7格式 

	// 获取上个月天数
	let lastMonthCnt = getLastMonthCnt(year, month);
	if (month == 1) {
		month = 12;
		--year;
	} else
		--month;

	let dayArr = [];
	for (let i = space; i >= 1; i--) {
		let lunar = that.data.isLunar ? sloarToLunar(year, month, lastMonthCnt - i + 1) : '';
		let holiday = isHoliday(lunar);
		let full = year + '-' + fmtDate(month) + '-' + fmtDate(lastMonthCnt - i + 1);
		dayArr.push({ 
			lunar,
			holiday,
			show: lastMonthCnt - i + 1,
			curMonth: false,
			weekNo: 1, //必然第一周
			val: year + '-' + month + '-' + (lastMonthCnt - i + 1),
			full
		});
	}
	return dayArr;

} 

/**
 * //从下月补几天
 * @param {*} year 
 * @param {*} month 
 * @param {*} hasDayLen  已有多少天
 */
export function getNextMonthArr(that, year, month, hasDayLen) {

	if (that.mode == 'multi') {
		if (month == 12) {
			month = 1;
			++year;
		} else
			month++;

		// 多选统一补成6行
		let dayArr = [];
		for (let i = 1; i <= (6 * 7 - hasDayLen); i++) {
			let weekNo = Math.ceil((hasDayLen + i) / 7); // 计算当前是第几周 

			let lunar = that.data.isLunar ? sloarToLunar(year, month, i) : '';
			let holiday = isHoliday(lunar);
			let full = year + '-' + fmtDate(month) + '-' + fmtDate(i);
			dayArr.push({ 
				lunar,
				holiday,
				has: false, //是否有数据
				show: i,
				curMonth: false,
				weekNo,
				val: year + '-' + month + '-' + i,
				full
			});
		}
	} else {
		// 单选只把最后一行补齐
		let endDay = getMonthCnt(year, month); //最后一天

		let time = new Date(year, month - 1, endDay);
		let space = time.getDay(); //获取当前星期X(0-6,0代表星期天)  
		space = 7 - space;
		if (space == 7) space = 0;

		if (space <= 0) return [];

		if (month == 12) {
			month = 1;
			++year;
		} else
			month++;

		let dayArr = [];
		for (let i = 1; i <= space; i++) {
			let lunar = that.data.isLunar ? sloarToLunar(year, month, i) : '';
			let holiday = isHoliday(lunar);
			let full = year + '-' + fmtDate(month) + '-' + fmtDate(i);
			dayArr.push({ 
				lunar,
				holiday,
				show: i,
				curMonth: false,
				weekNo: that.data.weekNo,
				val: year + '-' + month + '-' + i,
				full
			});
		}
		return dayArr;
	}


	return dayArr;

}


export function createDay(that) {
	// 创建日历
	let month = that.data.month;
	let year = that.data.year;

	let dayArr = [];
	let len = getMonthCnt(year, month);
	for (let i = 1; i <= len; i++) {
		let lunar = that.data.isLunar ? sloarToLunar(year, month, i) : '';
		let holiday = isHoliday(lunar);
		let full = year + '-' + fmtDate(month) + '-' + fmtDate(i) //实际日期(补位);
		dayArr.push({ 
			lunar,
			holiday,
			has: false, //是否有数据
			show: i, // 显示
			curMonth: true, //是否当前月
			weekNo: weekIndexInMonth(year, month, i), //第几周
			val: year + '-' + month + '-' + i, //实际日期(简化)
			full
		});
	}


	// 前后补空 
	let lastArr = getLastMonthArr(that, year, month);
	let nextArr = getNextMonthArr(that, year, month, dayArr.length + lastArr.length);

	let data = lastArr.concat(dayArr).concat(nextArr);

	/*
	// 数据循环处理
	let hasDays = that.data.hasDays;
	if (hasDays.length > 0) {
		for (let j in hasDays) {
			for (let k in data) {
				if (data[k].full == hasDays[j]) {
					data[k].has = true; //当日有数据
				}
			}
		}
	}*/

	// 当前操作日为周几？ 仅针对单选模式
	let weekNo = 0;
	if (that.data.mode == 'one') {
		if (!that.data.oneDoDay) {
			weekNo = weekIndexInMonth();
		} else {
			let arr = that.data.oneDoDay.split('-');
			weekNo = weekIndexInMonth(arr[0], arr[1], arr[2]);
		}
	}

	that.setData({
		weekNo,
		dayArr: data
	});
}

 /** ListTouch触摸开始 */
export function listTouchStart(e, that) {
    that.setData({
        touchX: e.touches[0].pageX
    })
}

/** ListTouch计算方向 */
export function listTouchMove(e, that, precision = 50) {
    if (that.data.touchX - e.touches[0].pageX > precision) {
        that.setData({
            touchDirection: 'left'
        });
    } else if (that.data.touchX - e.touches[0].pageX < -precision) {
        that.setData({
            touchDirection: 'right'
        });
    }

}

/** ListTouch计算滚动 */
export function listTouchEnd(that) {
	if (that.data.touchDirection == 'left') {
		that.setData({
			animation: 'slide-left'
		});

		setTimeout(function () {
			that.setData({
				animation: ''
			})
		}, 200);
		that.bindNextTap();
	} else if (that.data.touchDirection == 'right') {
		that.setData({
			animation: 'slide-right'
		});

		setTimeout(function () {
			that.setData({
				animation: ''
			})
		}, 200);
		that.bindLastTap();
	}

	that.setData({
		touchDirection: null
	});
}

// 回本月
export function bindToNowTap(that) {
	const time = new Date();
	let year = time.getFullYear();
	let month = time.getMonth() + 1;

	that.setData({
		month,
		year,
		fold: false
	});

	that.setData({
		animation: 'fade'
	});

	setTimeout(function () {
		that.setData({
			animation: ''
		})
	}, 300);
	createDay(that);

	if (that.data.mode == 'one') {
		//月份切换引起父组件变动 
		that.triggerEvent('monthChange', {
			yearMonth: that.data.year + '-' + padLeft(that.data.month, 2, '0')
		});
	}
}

//多选天点击
export function bindDayMultiTap(e, that) {

	// 显示
	let oneDoDay = e.currentTarget.dataset.fullday;
	let multiDoDay = deepClone(that.data.multiDoDay);

	if (that.data.multiOnlyOne) {
		// 只能选一个
		multiDoDay = [oneDoDay];
	} else {
		multiDoDay = arrAddDel(multiDoDay, oneDoDay);
	}
	if (multiDoDay.length < that.data.multiDoDay.length) {
		// 有取消
		that.triggerEvent('cancel', {
			day: oneDoDay
		});
	}

	that.setData({
		multiDoDay
	});

	// 传递给父组件
	that.triggerEvent('click', {
		days: multiDoDay
	});
}

//单个天点击
export function bindDayOneTap(e, that) {
	// 显示
	let oneDoDay = e.currentTarget.dataset.fullday;

	// 当前周
	let weekNo = 0;
	let arr = oneDoDay.split('-');
	weekNo = weekIndexInMonth(arr[0], arr[1], arr[2]);

	that.setData({
		oneDoDay,
		weekNo
	});

	// 传递给父组件
	that.triggerEvent('click', {
		day: oneDoDay
	});
}

//  下月
export function bindNextTap(that) {
	let month = that.data.month;
	if (month == 12) {
		that.setData({
			year: that.data.year + 1,
			month: 1,
			fold: false //翻页不折叠
		})
	} else {
		that.setData({
			month: month + 1,
			fold: false
		})
	}
	createDay(that);

	if (that.data.mode == 'one') {
		//月份切换引起父组件变动 
		that.triggerEvent('monthChange', {
			yearMonth: that.data.year + '-' + padLeft(that.data.month, 2, '0')
		});
	}
}

// 上个月
export function bindLastTap(that) {
	let month = that.data.month;
	if (month == 1) {
		that.setData({
			year: that.data.year - 1,
			month: 12,
			fold: false
		})
	} else {
		that.setData({
			month: month - 1,
			fold: false
		})
	}
	createDay(that);

	if (that.data.mode == 'one') {
		//月份切换引起父组件变动 
		that.triggerEvent('monthChange', {
			yearMonth: that.data.year + '-' + padLeft(that.data.month, 2, '0')
		});
	}
}

// 日历折叠
export function bindFoldTap(that) {
	if (that.data.fold)
		that.setData({
			fold: false
		});
	else {
		//that._init(); //折叠回本月
		that.setData({
			fold: true
		});
	}
}
