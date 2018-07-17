import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';

const router = Router();

export default (config: ConfigStore, port: string): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];
    router.get('/', /*authenticate(TOKEN_A),*/ async (req: Request, res: Response) => {
        console.log('GET /2.1.1');
        res.send(<IResponse>{
            status_code: 1000,
            data: {
                "version": "2.1.1",
                "endpoints": [
                  {
                    "identifier": "credentials",
                    "url": "http://localhost:3005/ocpi/cpo/2.1.1/credentials"
                  },
                  {
                    "identifier": "tokens",
                    "url": "http://localhost:3005/ocpi/cpo/2.1.1/tokens"
                  },
                  {
                    "identifier": "tariffs",
                    "url": "http://localhost:3005/ocpi/cpo/2.1.1/tariffs"
                  },
                  {
                    "identifier": "locations",
                    "url": "http://localhost:3005/ocpi/cpo/2.1.1/locations"
                  },
                  {
                    "identifier": "sessions",
                    "url": "http://localhost:3005/ocpi/cpo/2.1.1/sessions"
                  }
                ]
            },
            timestamp: new Date()
        });
    });
    return router;
}
