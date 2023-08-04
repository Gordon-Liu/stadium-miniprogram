import { AdminClient } from '../cloud';

export default class AdminStadiumApi {
    static client = new AdminClient();
    
    static detail (id) {
        return this.client.request('/admin/stadium/detail', {
            id
        });
    }

    static insert(data) {
        return this.client.request('/admin/stadium/insert', data);
    }

    static edit (data) {
        return this.client.request('/admin/stadium/edit', data);
    }

    static cancelTime (id, reason, timeMark) {
        return this.client.request('/admin/stadium/cancel/time', {
            id,
            reason,
            timeMark
        });
    }

    static dayList (stadiumId, start, end) {
        return this.client.request('/admin/stadium/day/list', {
            stadiumId,
            start,
            end,
        });
    }
}