import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import * as ConfigStore from 'configstore';
import authenticate from '../../middleware/authenticate';
import IVersions from './interfaces/IVersions';
import IResponse from './interfaces/iResponse';

export class Versions {

    router: Router;

    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    public async get(): Promise<IVersions[]> {
        try {
            const result = await request({
                method: 'GET', 
                uri: this.config.get('cpo.versions'),
                headers: this.config.get('cpo.headers'),
                json: true
            });
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error('GET versions: ' + err.message);
        }
    }

    public serve(): Router {
        this.router.get('/versions', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            console.log('GET versions');
            try {
                res.send(<IResponse>{
                    status_code: 1000,
                    data: this.config.get('msp.versions'),
                    timestamp: new Date()
                });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 1000,
                    status_message: `Server error: ${err.message}`,
                    timestamp: new Date()
                });
            }
        });
        return this.router;
    }

}