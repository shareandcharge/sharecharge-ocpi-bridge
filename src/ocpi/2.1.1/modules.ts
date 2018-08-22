import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import send from '../../services/send';
import authenticate from '../../middleware/authenticate';
import IModules from './interfaces/iModules';
import IResponse from './interfaces/iResponse';

export class Modules {

    router: Router;

    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    public async get(): Promise<IModules> {
        try {
            const result = await send({
                method: 'GET', 
                uri: this.config.get('cpo.modules'),
                headers: this.config.get('cpo.headers')
            });
            return result;
        } catch (err) {
            throw Error('GET modules: ' + err.message);
        }
    }

    public serve(): Router {
        this.router.get('/', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            console.log('GET /modules');
            try {
                res.send(<IResponse>{
                    status_code: 1000,
                    data: this.config.get('msp.modules'),
                    timestamp: new Date()
                });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 3000,
                    status_message: `Server error: ${err.message}`,
                    timestamp: new Date()
                });
            }
        });
        return this.router;
    }
}