import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class Sessions {

    host: any;
    endpoint: string;

    constructor(config: ConfigStore) {
        this.endpoint = `/sessions`;
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
    }

    public success(): void {
        this.host.get(this.endpoint)
            .query({ date_from: new Date(0) })
            .reply(200, ocpiSuccess([{
                "id": "101",
                "start_datetime": "2015-06-29T22:39:09Z",
                "kwh": 0.00,
                "auth_id": "DE8ACC12E46L89",
                "auth_method": "WHITELIST",
                "location": {
                    "id": "LOC1",
                    "type": "ON_STREET",
                    "name": "Gent Zuid",
                    "address": "F.Rooseveltlaan 3A",
                    "city": "Gent",
                    "postal_code": "9000",
                    "country": "BE",
                    "coordinates": {
                        "latitude": "3.729944",
                        "longitude": "51.047599"
                    },
                    "evses": [{
                        "uid": "3256",
                        "evse_id": "BE-BEC-E041503003",
                        "status": "AVAILABLE",
                        "connectors": [{
                            "id": "1",
                            "standard": "IEC_62196_T2",
                            "format": "SOCKET",
                            "power_type": "AC_1_PHASE",
                            "voltage": 230,
                            "amperage": 64,
                            "tariff_id": "11",
                            "last_updated": "2015-06-29T22:39:09Z"
                        }],
                        "last_updated": "2015-06-29T22:39:09Z"
                    }],
                    "last_updated": "2015-06-29T22:39:09Z"
                },
                "currency": "EUR",
                "total_cost": 2.50,
                "status": "PENDING",
                "last_updated": "2015-06-29T22:39:09Z"
            }]));
    }

    public ocpiError(): void {
        this.host.get(this.endpoint)
            .query({ date_from: new Date(0) })
            .reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get(this.endpoint)
            .query({ date_from: new Date(0) })
            .reply(500, 'Internal server error');
    }
}