import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import * as request from 'request-promise-native';
// import authenticate from '../../../../src/middleware/authenticate';
import IResponse from '../../../../src/ocpi/2.1.1/interfaces/iResponse';


const router = Router();

export default (config: ConfigStore): Router => {
    const TOKEN_A = config.get('cpo.headers.Authorization').split(' ')[1];
    router.post('/commands/START_SESSION', /* authenticate(TOKEN_A), */ async (req: Request, res: Response) => {
        console.log(`POST /commands/START_SESSION on location ${req.body.location_id}`);
        setTimeout(async () => {
            await request({
                method: 'POST',
                uri: req.body.response_url,
                headers: {
                    Authorization: 'Token ' + config.get('msp.credentials.token')
                },
                body: {
                    result: 'ACCEPTED'
                },
                json: true
            });
        }, 1000);
        res.send(<IResponse>{
            status_code: 1000,
            data: {
                result: 'ACCEPTED'
            },
            timestamp: new Date()
        })
    });
    router.post('/commands/STOP_SESSION', /* authenticate(TOKEN_A), */ async (req: Request, res: Response) => {
        console.log(`POST /commands/STOP_SESSION on location ${req.body.location_id}`);
    });
    return router;
}