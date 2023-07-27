import { AdminClient } from '../cloud';

export default class AdminStadiumApi {
    static client = new AdminClient();

    static detail (id) {
        return this.client.request('/admin/stadium/detail', {
            id
        });
    }
}