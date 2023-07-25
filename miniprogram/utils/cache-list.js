import { CACHE_IS_LIST, CACHE_LIST_TIME } from '../settings/setting';
import { get, set, remove } from './cache';
  

export function isCacheList(key) {
	key = key.toUpperCase();
	if (CACHE_IS_LIST)
		return get(key + '_LIST');
	else
		return false;
}

export function removeCacheList(key) {
	key = key.toUpperCase();
	if (CACHE_IS_LIST)
		remove(key + '_LIST');
}

export function setCacheList(key, time = CACHE_LIST_TIME) {
	key = key.toUpperCase();
	if (CACHE_IS_LIST)
		set(key + '_LIST', 'TRUE', time);
}