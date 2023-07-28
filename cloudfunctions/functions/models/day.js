const Model = require('../framework/model.js');

class DayModel extends Model {

}

// 集合名
DayModel.CL = "db_day";

DayModel.DB_STRUCTURE = {
	id: 'string|true',
	stadium_id: 'string|true',

	day: 'string|true|comment=日期 yyyy-mm-dd',
	day_desc: 'string|true|comment=描述',
	times: 'array|true|comment=具体时间段',
	/*
		{
			1. mark=唯一性标识,
			2. start=开始时间点hh:mm ～,  
			3. end=结束时间点hh:mm, 
			4. isLimit=是否人数限制, 
			5. limit=报名上限,  
			6. status=状态 0/1
			7. stat:{ //统计数据 
				succCnt=1预约成功*, 
				cancelCnt=10已取消, 
				adminCancelCnt=99后台取消
			}
		}', 
	*/

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

module.exports = DayModel;