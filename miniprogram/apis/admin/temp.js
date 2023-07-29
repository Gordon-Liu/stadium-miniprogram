import { AdminClient } from '../cloud';

export default class AdminTempApi {
    static client = new AdminClient();
    
    static insert (name, times) {
        return this.client.request('/admin/temp/insert', {
            name,
            times
        });
    }

    static list () {
        return this.client.request('/admin/temp/list');
    }

    static edit (id, limit, isLimit) {
        return this.client.request('/admin/temp/edit', {
            id,
            limit,
            isLimit
        });
    }

    static delete (id) {
        return this.client.request('/admin/temp/delete', {
            id,
        });
    }
}