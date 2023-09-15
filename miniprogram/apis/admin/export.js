import { AdminClient } from '../cloud';

export default class AdminExportApi {
    static client = new AdminClient();

    static userDataGet (isDel) {
        return this.client.request('/admin/export/user_data_get', {
            isDel
        });
    }

    static userDataExport (condition) {
        return this.client.request('/admin/export/user_data_export', {
            condition
        });
    }
}