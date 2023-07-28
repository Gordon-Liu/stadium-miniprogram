import { AdminClient } from '../cloud';

export default class AdminTempApi {
    static client = new AdminClient();
    
    static insert (name, times) {
        return this.client.request('/admin/temp/insert', {
            name,
            times
        });
    }

}