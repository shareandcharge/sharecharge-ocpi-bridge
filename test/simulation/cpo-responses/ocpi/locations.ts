import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';

export class Locations {

    host: any;
    endpoint: string;

    constructor(config: ConfigStore) {
        this.endpoint = '/locations';
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
    }

    public success(locationId: string): void {
        this.host.get(this.endpoint + '/' + locationId)
            .reply(200, ocpiSuccess({
                "id": "LOC1",
                "type": "ON_STREET",
                "name": "Gent Zuid",
                "address": "F.Rooseveltlaan 3A",
                "city": "Gent",
                "postal_code": "9000",
                "country": "BEL",
                "coordinates": {
                    "latitude": "51.047599",
                    "longitude": "3.729944"
                },
                "evses": [{
                    "uid": "3256",
                    "evse_id": "BE-BEC-E041503001",
                    "status": "AVAILABLE",
                    "status_schedule": [],
                    "capabilities": [
                        "RESERVABLE"
                    ],
                    "connectors": [{
                        "id": "1",
                        "standard": "IEC_62196_T2",
                        "format": "CABLE",
                        "power_type": "AC_3_PHASE",
                        "voltage": 220,
                        "amperage": 16,
                        "tariff_id": "11",
                        "last_updated": "2015-03-16T10:10:02Z"
                    }],
                    "physical_reference": "1",
                    "floor_level": "-1",
                     "last_updated": "2015-06-28T08:12:01Z"
                }],
                "operator": {
                    "name": "BeCharged"
                },
                "last_updated": "2015-06-29T20:39:09Z"
            }));
    }

    public ocpiError(locationId: string): void {
        this.host.get(this.endpoint + '/' + locationId).reply(200, ocpiError());
    }

    public httpError(locationId: string): void {
        this.host.get(this.endpoint + '/' + locationId).reply(500, 'Internal server error');
    }
}