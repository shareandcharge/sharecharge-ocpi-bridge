import * as nock from 'nock';
import { config } from '../../../config/config';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class Versions {

    endpoint: string;
    host: any;

    constructor() {
        this.endpoint = '/versions';
        this.host = nock(config.host);
    }

    public success(): void {
        this.host.get(this.endpoint)
            .reply(200, ocpiSuccess([
                {
                    "version": "2.1.1",
                    "url": "https://example.com/ocpi/cpo/2.1.1/"
                },
                {
                    "version": "2.0",
                    "url": "https://example.com/ocpi/cpo/2.0/"
                }
            ]));
    }

    public ocpiError(): void {
        this.host.get(this.endpoint).reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get(this.endpoint).reply(400)
    }

}