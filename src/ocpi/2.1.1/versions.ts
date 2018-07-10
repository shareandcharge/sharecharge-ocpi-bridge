import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import authenticate from '../../middleware/authenticate';
import IVersions from './interfaces/IVersions';
import IConfig from '../../interfaces/iConfig';

export class Versions {

    router: Router;

    uri: string;

    constructor(private config: IConfig) {
        this.router = Router();
        this.uri = this.config.cpo.versions;
    }

    public findUrl(versions: IVersions[]): string {
        // select IVersion object that matches config version
        const version = versions.filter(v => v.version === this.config.version);
        return version[0].url;
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
        this.router.get('/versions', authenticate, async (req: Request, res: Response) => {
            res.send(this.config.msp.versions);
        });
        return this.router;
    }

}