import * as nock from 'nock';
import { config } from '../../../config/config';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class Modules {

    endpoint: string;
    host: any;

    constructor() {
        this.endpoint = '/';
        this.host = nock(config.host + config.version);
    }

    public success(): void {
        this.host.get(this.endpoint)
            .reply(200, ocpiSuccess({
                "version": "2.0",
                "endpoints": [
                    {
                        "identifier": "credentials",
                        "url": "https://example.com/ocpi/cpo/2.0/credentials/"
                    },
                    {
                        "identifier": "locations",
                        "url": "https://example.com/ocpi/cpo/2.0/locations/"
                    }
                ]
            }));
    }

    public ocpiError(): void {
        this.host.get(this.endpoint)
            .reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get(this.endpoint)
            .reply(500, 'Internal server error');
    }
}