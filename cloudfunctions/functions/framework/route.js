module.exports = {
    '/stadium/home/list': 'stadium@getHomeList',

    '/reservation/my/list': 'reservation@getMyList',
    '/reservation/my/someday': 'reservation@getMySomeday',

    '/news/list': 'news@getList',
	'/news/home/list': 'news@getHomeList',
    '/news/detail': 'news_controller@getDetail', 
    
    // admin new controller
    '/admin/home': 'admin/home@home',
    '/admin/home/login': 'admin/home@login',

    '/admin/news/list': 'admin/news@getList',
	'/admin/news/insert': 'admin/news@insert',
	'/admin/news/detail': 'admin/news@getDetail',
	'/admin/news/edit': 'admin/news@edit',
	'/admin/news/update/pic': 'admin/news@updatePic',
	'/admin/news/update/content': 'admin/news@updateContent',
	'/admin/news/del': 'admin/news@del', 
	'/admin/news/sort': 'admin/news@sort',
	'/admin/news/status': 'admin/news@status',
};