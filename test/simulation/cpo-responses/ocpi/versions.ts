import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class Versions {

    host: any;

    constructor(config: ConfigStore) {
        this.host = nock(config.get('cpo.versions'), {
            reqheaders: config.get('cpo.headers')
        });
    }

    public success(): void {
        this.host.get('')
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

    public noMutualVersion(): void {
        this.host.get('')
            .reply(200, ocpiSuccess([
                {
                    "version": "2.0",
                    "url": "https://example.com/ocpi/cpo/2.0/"
                }
            ]));
    }

    public ocpiError(): void {
        this.host.get('').reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get('').reply(400, 'Bad Request');
    }

}