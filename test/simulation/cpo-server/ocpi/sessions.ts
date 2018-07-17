import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
// import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';

const router = Router();

export default (config: ConfigStore): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];
    router.get('/sessions', /* authenticate(TOKEN_A), */ async (req: Request, res: Response) => {
        console.log(`GET /sessions/?date_from='${req.query.date_from}'`);
        res.send(<IResponse>{
            status_code: 1000,
            data: [{
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
            }],
            timestamp: new Date()
        });
    });
    return router;
}