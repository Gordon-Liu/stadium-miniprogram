module.exports = {
    //### 环境相关 
    CLOUD_ID: 'lgd-dev-1gz7qcgf24f666b0', //你的云环境id 
    
    // ### 后台业务相关
    ADMIN_LOGIN_EXPIRE: 86400, //管理员token过期时间 (秒) 
    
    // ## 缓存相关 
	IS_CACHE: true, //是否开启缓存
    CACHE_CALENDAR_TIME: 60 * 30, //日历缓存   
    
    // #### 预约相关
    STADIUM_LOG_LEVEL: 'debug',
    
    //数据导出路径
    DATA_EXPORT_PATH: 'export/', 
}