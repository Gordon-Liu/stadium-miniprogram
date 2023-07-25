 /**
  * 判断变量，参数，对象属性是否定义
  * @param {*} val 
  */
export function isDefined(val) {
    // ==  不能判断是否为null
    if (val === undefined)
        return false;
    else
        return true;
}

 /**
  * 取得data-数据 去掉驼峰式命名，改成纯小写式命名
  * @param {*} e 
  * @param {*} name 
  * @param {*} child  是否获取穿透子元素的data-
  */
export function dataset(e, name, child = false) {
    if (!child)
        return e.currentTarget.dataset[name];
    else
        return e.target.dataset[name];
}