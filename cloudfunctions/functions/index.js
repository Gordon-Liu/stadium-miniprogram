// 云函数入口函数
const application = require('./framework/application.js');
const dbUtil = require('./framework/db-util.js');
const AdminModel = require('./models/admin.js');

exports.main = async (event, context) => {

    // const dbArray = ['db_stadium', 'db_reservation', 'db_news', 'db_user', 'db_log', 'db_admin', 'db_day', 'db_cache', 'db_temp'];
    // for (let k in dbArray) {
    //     if (!await dbUtil.isExistCollection(dbArray[k])) {
    //         await dbUtil.createCollection(dbArray[k]);
    //         console.log(dbArray[k])
    //         if (dbArray[k] === 'db_admin') {
    //             let data = {
    //                 name: 'admin',
    //                 password: '123456',
    //                 phone: '15800000000',
    //                 type: 1
    //             };
    //             try {
    //                 await AdminModel.insert(data);
    //             } catch (e) {
    //                 console.log(e)
    //             } 
    //         }
    //     }
    // }
    return await application(event, context);
};