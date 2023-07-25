import { set, get, remove } from './cache';
import { ADMIN_TOKEN_EXPIRE } from '../settings/setting';

export const CACHE_ADMIN = 'ADMIN_TOKEN'; // 管理员登录

export default class AdminToken {
    static setAdmin(admin) {
        set(CACHE_ADMIN, admin, ADMIN_TOKEN_EXPIRE);
    }

    static getAdmin(admin) {
        return get(CACHE_ADMIN);
    }

    /**
	 * 清空管理员登录
	 */
	static clear() {
		remove(CACHE_ADMIN);
	}
}