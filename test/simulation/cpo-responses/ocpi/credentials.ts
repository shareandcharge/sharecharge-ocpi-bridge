import * as nock from 'nock';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import Config from '../../../../src/models/config';

export class Credentials {

    endpoint: string;
    host: any;

    constructor(config: Config) {
        this.endpoint = '/credentials';
        this.host = nock(config.cpo.modules, {
            reqheaders: config.cpo.headers
        });
    }

    public getSuccess(): void {
        this.host.get(this.endpoint)
            .reply(200, ocpiSuccess({
                "url": "https://example.com/ocpi/cpo/versions/",
                "token": "ebf3b399-779f-4497-9b9d-ac6ad3cc44d2",
                "party_id": "EXA",
                "country_code": "NL",
                "business_details": {
                    "name": "Example Operator",
                    "logo": {
                        "url": "https://example.com/img/logo.jpg",
                        "thumbnail": "https://example.com/img/logo_thumb.jpg",
                        "category": "OPERATOR",
                        "type": "jpeg",
                        "width": 512,
                        "height": 512
                    },
                    "website": "http://example.com"
                }
            }));
    }

    public getOcpiError(): void {
        this.host.get(this.endpoint).reply(200, ocpiError());
    }

    public getHttpError(): void {
        this.host.get(this.endpoint).reply(400, 'Bad request');
    }

    public postSuccess(): void {
        this.host.post(this.endpoint)
            .reply(200, ocpiSuccess({
                "url": "https://example.com/ocpi/cpo/versions/",
                "token": "e345383a-ba4c-4514-bc99-e0152ceea4c5",
                "party_id": "EXA",
                "country_code": "NL",
                "business_details": {
                    "name": "Example Operator",
                    "logo": {
                        "url": "https://example.com/img/logo.jpg",
                        "thumbnail": "https://example.com/img/logo_thumb.jpg",
                        "category": "OPERATOR",
                        "type": "jpeg",
                        "width": 512,
                        "height": 512
                    },
                    "website": "http://example.com"
                }
            }))
    }

    public postOcpiError(): void {
        this.host.post(this.endpoint).reply(200, ocpiError());
    }

    public postHttpError(): void {
        this.host.post(this.endpoint).reply(500, 'Internal server error');
    }


}