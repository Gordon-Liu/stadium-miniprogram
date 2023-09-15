import { AdminClient } from '../cloud';

export default class AdminUserApi {
    static client = new AdminClient();

    static delete (id) {
        return this.client.request('/admin/user/delete', {
            id
        });
    }
}