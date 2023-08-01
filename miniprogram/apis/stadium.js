import { Client } from './cloud';

export default class StadiumApi {
    static client = new Client();

    static getDetail(id) {
        return this.client.request('/stadium/detail', {
            id
        });
    }

    static beforeReservation(id, timeMark) {
        return this.client.request('/stadium/before/reservation', {
            id,
            timeMark
        });
    }

    static getDetailForReservation(id, timeMark) {
        return this.client.request('/stadium/detail/for/reservation', {
            id,
            timeMark
        });
    }
}