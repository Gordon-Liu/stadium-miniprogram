import { Client } from './cloud';

export default class UserApi {
    static client = new Client();

    static login() {
        return this.client.request('/user/login');
    }

    static getDetail () {
        return this.client.request('/user/detail');
    }

    static edit(data) {
        return this.client.request('/user/edit', data);
    }

    static getPhone(cloudID) {
        return this.client.request('/user/getPhone', {
            cloudID
        });
    }
}