import * as nock from 'nock';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import IConfig from '../../../src/interfaces/iConfig';

const config: IConfig = require('../../../config/config.json');

export class Modules {

    endpoint: string;
    host: any;

    constructor() {
        this.endpoint = '/';
        this.host = nock(config.cpo.host + config.version);
    }

    public success(): void {
        this.host.get(this.endpoint)
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
        this.host.get(this.endpoint).reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get(this.endpoint).reply(500, 'Internal server error');
    }
}