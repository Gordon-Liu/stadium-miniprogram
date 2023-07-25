import { AdminClient } from '../cloud';

export default class AdminHomeApi {
    static client = new AdminClient();

    static login (name, password) {
        return this.client.request('/admin/home/login', {
            name,
            password
        });
    }

    static home () {
        return this.client.request('/admin/home');
    }
}