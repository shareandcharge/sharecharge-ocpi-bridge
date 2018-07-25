import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class CDRs {

    host: any;
    endpoint: string;

    constructor(config: ConfigStore) {
        this.endpoint = '/cdrs';
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
    }

    public success(): void {
        this.host.get(this.endpoint)
            .reply(200, ocpiSuccess([{
                "id": "12345",
                "start_date_time": "2015-06-29T21:39:09Z",
                "stop_date_time": "2015-06-29T23:37:32Z",
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
                            "last_updated": "2015-06-29T21:39:01Z"
                        }],
                        "last_updated": "2015-06-29T21:39:01Z"
                    }],
                    "last_updated": "2015-06-29T21:39:01Z"
                },
                "currency": "EUR",
                "tariffs": [{
                    "id": "12",
                    "currency": "EUR",
                    "elements": [{
                        "price_components": [{
                            "type": "TIME",
                            "price": "2.00",
                            "step_size": 300
                        }],
                    }],
                    "last_updated": "2015-02-02T14:15:01Z"
                }],
                "charging_periods": [{
                    "start_date_time": "2015-06-29T21:39:09Z",
                    "dimensions": [{
                        "type": "TIME",
                        "volume": 1.973
                    }]
                }],
                "total_cost": 4.00,
                "total_energy": 15.342,
                "total_time": 1.973,
                "last_updated": "2015-06-29T22:01:13Z"
            }]));
    }

    public ocpiError(): void {
        this.host.get(this.endpoint).reply(200, ocpiError());
    }

    public httpError(): void {
        this.host.get(this.endpoint).reply(500, 'Internal server error');
    }
}