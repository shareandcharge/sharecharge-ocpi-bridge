import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import Helpers from '../../../../src/helpers/helpers';
import authenticate from '../../../../src/middleware/authenticate';
import Config from '../../../../src/models/config';

const config: Config = require('../../../config/config.json');
const TOKEN_A = config.cpo.headers.Authorization.split(' ')[1];
const headers = {
    Authorization: `Token ${config.msp.credentials.token}`
};

const router = Router();

export default (): Router => {
    router.post('/credentials', authenticate(TOKEN_A), async (req: Request, res: Response) => {
        // get versions
        const versionsResult = await request({
            method: 'GET',
            uri: config.msp.versions[0].url,
            headers
        });
        // get modules
        await request({
            method: 'GET',
            uri: versionsResult[0].url,
            headers
        });
        const TOKEN_C = Helpers.generateUUID();
        res.send(TOKEN_C);
    });
    return router;
}