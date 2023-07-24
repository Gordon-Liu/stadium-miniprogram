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

