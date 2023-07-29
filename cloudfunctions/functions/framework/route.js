module.exports = {
    '/stadium/home/list': 'stadium@getHomeList',

    '/reservation/my/list': 'reservation@getMyList',
    '/reservation/my/someday': 'reservation@getMySomeday',

    '/news/list': 'news@getList',
	'/news/home/list': 'news@getHomeList',
    '/news/detail': 'news_controller@getDetail', 

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

    // admin temp controller
    '/admin/temp/list': 'admin/temp@getList',
    '/admin/temp/insert': 'admin/temp@insert',
    '/admin/temp/edit': 'admin/temp@edit',
    '/admin/temp/delete': 'admin/temp@delete',
};