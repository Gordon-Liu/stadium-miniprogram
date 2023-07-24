// 云函数入口函数
const application = require('./framework/application.js');
const dbUtil = require('./framework/db-util.js');

exports.main = async (event, context) => {

    const dbArray = ['db_stadium', 'db_reservation', 'db_news', 'db_user', 'db_log', 'db_admin'];
    for (let k in dbArray) {
        if (!await dbUtil.isExistCollection(dbArray[k])) {
            await dbUtil.createCollection(dbArray[k]);
        }
    }
    return await application(event, context);
};