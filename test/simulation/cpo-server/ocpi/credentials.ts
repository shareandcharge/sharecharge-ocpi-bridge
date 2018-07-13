import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import * as ConfigStore from 'configstore';
import Helpers from '../../../../src/helpers/helpers';
import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';

const router = Router();

export default (config: ConfigStore): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];

    router.get('/credentials', async (req: Request, res: Response) => {
        console.log('GET /credentials');
        res.send(<IResponse>{
            status_code: 1000,
            data: {
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
            },
            timestamp: new Date()
        })
    });

    router.post('/credentials', authenticate(TOKEN_A), async (req: Request, res: Response) => {
        console.log('POST /credentials');

        // get versions
        const versionsResult = await request({
            method: 'GET',
            uri: req.body.url,
            headers: {
                Authorization: `Token ${config.get('msp.credentials.token')}`
            },
            json: true
        });
        // get modules
        await request({
            method: 'GET',
            uri: versionsResult.data[0].url,
            headers: {
                Authorization: `Token ${config.get('msp.credentials.token')}`
            }
        });
        const TOKEN_C = Helpers.generateUUID();
        res.send(<IResponse>{
            status_code: 1000,
            data: {
                token: TOKEN_C
            },
            timestamp: new Date()
        });
    });
    return router;
}