module.exports = {
    '/stadium/list': 'stadium@getList',
    '/stadium/detail': 'stadium@getDetail',
    '/stadium/before/reservation': 'stadium@beforeReservation',
    '/stadium/detail/for/reservation': 'stadium@getDetailForReservation',
    '/stadium/list/has/day': 'stadium@getListHasDay',
    '/stadium/list/by/day': 'stadium@getListByDay',
    '/stadium/reservation': 'stadium@reservation',

    '/reservation/my/list': 'reservation@getMyList',
    '/reservation/my/someday': 'reservation@getMySomeday',

    '/news/list': 'news@getList',
	'/news/home/list': 'news@getHomeList',
    '/news/detail': 'news@getDetail', 

    '/user/login': 'user@login', 
    '/user/detail': 'user@getDetail',
    '/user/edit': 'user@edit',
    '/user/getPhone': 'user@getPhone',
    
    '/admin/home': 'admin/home@home',
    '/admin/home/login': 'admin/home@login',

    // admin new controller
    '/admin/news/list': 'admin/news@getList',
	'/admin/news/insert': 'admin/news@insert',
	'/admin/news/detail': 'admin/news@getDetail',
	'/admin/news/edit': 'admin/news@edit',
	'/admin/news/del': 'admin/news@del', 
	'/admin/news/sort': 'admin/news@sort',
    '/admin/news/status': 'admin/news@status',
    
    // admin stadium controller
    '/admin/stadium/list': 'admin/stadium@getList',
    '/admin/stadium/insert': 'admin/stadium@insert',
    '/admin/stadium/edit': 'admin/stadium@edit',
    '/admin/stadium/day/list': 'admin/stadium@getDayList',

    // admin temp controller
    '/admin/temp/list': 'admin/temp@getList',
    '/admin/temp/insert': 'admin/temp@insert',
    '/admin/temp/edit': 'admin/temp@edit',
    '/admin/temp/delete': 'admin/temp@delete',

    // admin reservation controller
    '/admin/reservation/list': 'admin/reservation@getList',

    // admin user controller
    '/admin/user/list': 'admin/user@getList',
    '/admin/user/delete': 'admin/user@delete',

    // admin export controller
    '/admin/export/user_data_get': 'admin/export@userDataGet',
    '/admin/export/user_data_export': 'admin/export@userDataExport'
};