import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
// import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';

const router = Router();

export default (config: ConfigStore): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];
    router.get('/tariffs', /* authenticate(TOKEN_A), */ async (req: Request, res: Response) => {
        res.send(<IResponse>{
            status_code: 1000,
            data: {
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
            },
            timestamp: new Date()
        });
    });
    return router;
}