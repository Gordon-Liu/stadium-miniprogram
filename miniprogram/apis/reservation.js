import { Client } from './cloud';

export default class ReservationApi {
    static client = new Client();

    static myList () {
        return this.client.request('/reservation/my/list');
    }

    static getMySomeday (day) {
        return this.client.request('/reservation/my/someday', {
            day
        });
    }
}