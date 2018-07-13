import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';

const router = Router();

export default (config: ConfigStore, port: string): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];
    router.get('/versions', authenticate(TOKEN_A), async (req: Request, res: Response) => {
        console.log('GET /versions');
        res.send(<IResponse>{
            status_code: 1000,
            data: [
                {
                    version: '2.1.1',
                    url: `http://localhost:${port}/ocpi/cpo/${config.get('version')}`
                }
            ],
            timestamp: new Date()
        });
    });
    return router;
}
