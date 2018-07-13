import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import * as ConfigStore from 'configstore';
import Helpers from '../../../../src/helpers/helpers';
import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';

const router = Router();

export default (config: ConfigStore): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];
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