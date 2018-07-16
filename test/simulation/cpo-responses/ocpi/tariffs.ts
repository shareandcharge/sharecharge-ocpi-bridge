import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class Tariffs {

    host: any;
    endpoint: string;

    constructor(config: ConfigStore) {
        this.endpoint = '/tariffs';
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
    }

    public success(): void {
        this.host.get(this.endpoint)
            .reply(200, ocpiSuccess([{
                "id": "12",
                "currency": "EUR",
                "elements": [{
                    "price_components": [{
                        "type": "TIME",
                        "price": 2.00,
                        "step_size": 300
                    }]
                }],
                "last_updated": "2015-06-29T20:39:09Z"
            }]));
    }

    public ocpiError(): void {
        this.host.get(this.endpoint).reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get(this.endpoint).reply(500, 'Internal server error');
    }
}