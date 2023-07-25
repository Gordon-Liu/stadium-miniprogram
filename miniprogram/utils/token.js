import { set, get } from './cache';

export const CACHE_TOKEN =  'CACHE_TOKEN'; // 登录;

export default class Token {
    static setUser(user) {
        set(CACHE_TOKEN, user);
    }

    static getUser(user) {
        get(CACHE_TOKEN);
    }
}