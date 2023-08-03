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

    static getListHasDay(day) {
        return this.client.request('/stadium/list/has/day', {
            day
        });
    }

    static getListByDay(day) {
        return this.client.request('/stadium/list/by/day', {
            day
        });
    }

    static reservation(stadiumId, timeMark, forms) {
        return this.client.request('/stadium/reservation', {
            stadiumId,
            timeMark,
            forms
        });
    }
}