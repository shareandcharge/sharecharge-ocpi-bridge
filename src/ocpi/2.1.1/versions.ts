import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import authenticate from '../../middleware/authenticate';
import IVersions from './interfaces/IVersions';
import IConfig from '../../interfaces/iConfig';

export class Versions {

    router: Router;

    uri: string;
    TOKEN_B: string;

    constructor(private config: IConfig) {
        this.router = Router();
        this.uri = this.config.cpo.versions;
        this.TOKEN_B = this.config.msp.credentials.token;
    }

    public async get(): Promise<IVersions[]> {
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
            throw Error('GET versions: ' + err.message);
        }
    }

    public serve(): Router {
        this.router.get('/versions', authenticate(this.TOKEN_B), async (req: Request, res: Response) => {
            res.send(this.config.msp.versions);
        });
        return this.router;
    }

}