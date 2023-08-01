import { Client } from './cloud';

export default class NewsApi {
    static client = new Client();

    static homeList () {
        return this.client.request('/news/home/list');
    }

    static getDetail(id) {
        return this.client.request('/news/detail', {
            id
        });
    }
}