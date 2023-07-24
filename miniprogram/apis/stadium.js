import { Client } from './cloud';

export default class StadiumApi {
    static client = new Client();

    static homeList () {
        return this.client.request('/stadium/home/list');
    }
}