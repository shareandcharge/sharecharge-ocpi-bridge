import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import * as ConfigStore from 'configstore';
import ICredentials from './interfaces/iCredentials';
import authenticate from '../../middleware/authenticate';
import Helpers from '../../helpers/helpers';
import IResponse from './interfaces/iResponse';

export class Credentials {

    router: Router;
    
    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    /**
     * Get credentials of Charge Point Operator
     * @returns TOKEN_A or TOKEN_C
     */
    public async get(): Promise<ICredentials> {
        try {
            const result = await request({
                method: 'GET',
                uri: Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'credentials'),
                headers: this.config.get('cpo.headers'),
                json: true
            });
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error(`GET credentials: ${err.message}`);
        }
    }

    /**
     * Post our eMobility Service Provider credentials to Charge Point Operator
     * @param TOKEN_B
     * @returns TOKEN_C
     */
    public async post(): Promise<ICredentials> {
        try {
            const result = await request({
                method: 'POST', 
                uri: Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'credentials'),
                headers: this.config.get('cpo.headers'),
                body: this.config.get('msp.credentials'),
                json: true
            });
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error(`POST credentials: ${err.message}`);
        }
    }

    public serve(): Router {
        this.router.get('/credentials', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            console.log('GET credentials');
            try {
                res.send(<IResponse>{
                    status_code: 1000,
                    data: this.config.get('msp.credentials'),
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