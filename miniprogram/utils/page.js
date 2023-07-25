 /**
  *  获取父页面
  * @param {*} deep  1=当前 2=父页 3=父父页
  */
export function getPrevPage(deep = 2) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - deep]; //上一个页面 
    return prevPage;
}

 // 跳到锚点
export function anchor(id, that) {
    let query = wx.createSelectorQuery().in(that);
    query.selectViewport().scrollOffset()
    //#comm 跳转到指定id位置
    query.select('#' + id).boundingClientRect();

    query.exec(function (res) {
        if (!res || res.length != 2 || !res[0] || !res[1]) return;
        //第一个为视图，第二个为当前id

        let miss = res[0].scrollTop + res[1].top - 10;
        wx.pageScrollTo({
            scrollTop: miss,
            duration: 300
        });
    });
}