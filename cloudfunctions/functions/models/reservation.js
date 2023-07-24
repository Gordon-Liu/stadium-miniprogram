// 用户的预约
const Model = require('../framework/model.js');

class ReservationModel extends Model {

}

// 集合名
ReservationModel.CL = 'db_reservation';

ReservationModel.DB_STRUCTURE = {
	id: 'string|true',

	edit_admin_id: 'string|false|comment=最近修改的管理员ID',
	edit_admin_name: 'string|false|comment=最近修改的管理员名',
	edit_admin_time: 'int|true|default=0|comment=管理员最近修改的时间',
	edit_admin_status: 'int|false|comment=最近管理员修改为的状态 ',

	is_admin: 'int|true|default=0|comment=是否管理员添加 0/1',

	code: 'string|true|comment=核验码15位',
	is_checkin: 'int|true|default=0|comment=是否签到 0/1 ',

	user_id: 'string|true|comment=用户ID',
	stadium_id: 'string|true|comment=预约PK',
	stadium_title: 'string|true|comment=项目',
	stadium_day: 'string|true|comment=日期',
	stadium_time_start: 'string|true|comment=时段开始',
	stadium_time_end: 'string|true|comment=时段结束',
	stadium_time_mark: 'string|true|comment=时段标识',

	start_time: 'int|true|comment=开始时间戳',

	forms: 'array|true|default=[]|comment=表单',
	/* title:
	   mark:
	   type:
	   val:
	*/

	status: 'int|true|default=1|comment=状态 1=预约成功,10=已取消, 99=系统取消',

	reason: 'string|false|comment=审核拒绝或者取消理由',

	add_time: 'int|true',
	edit_time: 'int|true',
	add_ip: 'string|false',
	edit_ip: 'string|false',
};

/**
 * 状态 1=预约成功,10=已取消, 99=后台取消 
 */
ReservationModel.STATUS = {
	SUCCESS: 1,
	CANCEL: 10,
	ADMIN_CANCEL: 99
};


ReservationModel.STATUS_DESC = {
	SUCCESS: '预约成功',
	CANCEL: '已取消',
	ADMIN_CANCEL: '系统取消',
};

module.exports = ReservationModel;
