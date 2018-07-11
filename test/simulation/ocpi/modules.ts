import * as nock from 'nock';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import Config from '../../../src/models/config';

export class Modules {

    host: any;

    constructor(config: Config) {
        this.host = nock(config.cpo.modules, {
            reqheaders: config.cpo.headers
        });
    }

    public success(): void {
        this.host.get('/')
            .reply(200, ocpiSuccess({
                "version": "2.1.1",
                "endpoints": [
                    {
                        "identifier": "credentials",
                        "url": "https://example.com/ocpi/cpo/2.1.1/credentials"
                    },
                    {
                        "identifier": "locations",
                        "url": "https://example.com/ocpi/cpo/2.1.1/locations"
                    }
                ]
            }));
    }

    public ocpiError(): void {
        this.host.get('/').reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get('/').reply(500, 'Internal server error');
    }
}