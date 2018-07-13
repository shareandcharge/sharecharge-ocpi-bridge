import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class Modules {

    host: any;

    constructor(config: ConfigStore) {
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
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