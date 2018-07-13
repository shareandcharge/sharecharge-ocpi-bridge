import { Router, Request, Response } from 'express';
import authenticate from '../../../../src/middleware/authenticate';
import Config from '../../../../src/models/config';

const config: Config = require('../../../config/config.json');
const TOKEN_A = config.cpo.headers.Authorization.split(' ')[1];

const router = Router();

export default (): Router => {
    router.get('/', authenticate(TOKEN_A), async (req: Request, res: Response) => {
        res.send({
            version: '2.1.1',
            endpoints: [
                {
                    identifier: 'credentials',
                    url: 'http://localhost:3005/ocpi/cpo/2.1.1/credentials'
                }
            ]
        });
    });
    return router;
}
