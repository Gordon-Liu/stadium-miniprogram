/**
 * 图片类型校验
 * @param {*} fileName 
 * @param {*} type 
 */
export function imgTypeCheck(path, type = ['jpg', 'jpeg', 'png','JPG','JPEG','PNG']) {
    let fmt = path.split(".")[(path.split(".")).length - 1];
	if (type.indexOf(fmt) > -1)
		return true;
	else
		return false;
}

/**
 * 图片大小校验
 * @param {*} size 
 * @param {*} maxSize 
 */
export function imgSizeCheck(size, maxSize) {
	return size < maxSize;
}
