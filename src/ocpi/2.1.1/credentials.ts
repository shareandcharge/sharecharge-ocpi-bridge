import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import ICredentials from './interfaces/iCredentials';
import IConfig from '../../interfaces/iConfig';
import authenticate from '../../middleware/authenticate';
import Helpers from '../../helpers/helpers';

export class Credentials {

    router: Router;
    
    uri: string;
    TOKEN_B: string;
    credentials: ICredentials;

    constructor(private config: IConfig) {
        this.router = Router();
        this.uri = Helpers.getEndpointByIdentifier(this.config.cpo.endpoints, 'credentials');
        this.TOKEN_B = this.config.msp.credentials.token;
        this.credentials = this.config.msp.credentials;
    }

    /**
     * Get credentials of Charge Point Operator
     * @returns TOKEN_A or TOKEN_C
     */
    public async get(): Promise<ICredentials> {
        try {
            const result = await request({
                method: 'GET',
                uri: this.uri,
                headers: this.config.cpo.headers,
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
                uri: this.uri, 
                headers: this.config.cpo.headers,
                body: this.credentials,
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
        this.router.get('/credentials', authenticate(this.TOKEN_B), async (req: Request, res: Response) => {
            console.log('GET credentials');
            res.send(this.credentials);
        });
        return this.router;
    }
    
}