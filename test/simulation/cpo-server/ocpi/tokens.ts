import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';
import IToken from '../../../../src/ocpi/2.1.1/interfaces/iToken';

const router = Router();

export default (config: ConfigStore): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];

    router.get('/tokens/:country/:party/:uid', async (req: Request, res: Response) => {
        console.log(`GET /tokens/${req.params.country}/${req.params.party}/${req.params.uid}`);
        res.send(<IResponse>{
            status_code: 1000,
            data: <IToken>{
                uid: req.params.uid,
                type: 'OTHER',
                auth_id: '12345',
                issuer: config.get('msp.credentials.business_details.name'),
                valid: true,
                whitelist: 'ALWAYS',
                last_updated: new Date()
            },
            timestamp: new Date()
        })
    });

    router.put('/tokens/:country/:party/:uid', /* authenticate(TOKEN_A), */ async (req: Request, res: Response) => {
        console.log(`PUT /tokens/${req.params.country}/${req.params.party}/${req.params.uid}`);
        console.log(JSON.stringify(req.body, null, 2));
        res.send(<IResponse>{
            status_code: 1000,
            status_message: 'Success',
            timestamp: new Date()
        });
    });
    return router;
}