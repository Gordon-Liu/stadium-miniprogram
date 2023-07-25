import { AdminClient } from '../cloud';

export default class AdminNewsApi {
    static client = new AdminClient();

    static insert (data) {
        return this.client.request('/admin/news/insert', data);
    }

    static updatePic (id, imgList) {
        return this.client.request('/admin/news/update/pic', {
            id,
            imgList
        });
    }
}