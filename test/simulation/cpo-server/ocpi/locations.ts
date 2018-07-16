import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
// import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';

const router = Router();

export default (config: ConfigStore): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];
    router.get('/locations/:id', /* authenticate(TOKEN_A), */ async (req: Request, res: Response) => {
        console.log(`GET /locations/${req.params.id}`);
        res.send(<IResponse>{
            status_code: 1000,
            data: {
                "id": req.params.id,
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
            },
            timestamp: new Date()
        });
    });
    return router;
}