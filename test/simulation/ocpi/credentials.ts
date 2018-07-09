import * as nock from 'nock';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import { config } from '../../../config/config';

export class Credentials {

    endpoint: string;
    host: any;

    constructor() {
        this.endpoint = '/credentials';
        this.host = nock(config.host + config.version);
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


}