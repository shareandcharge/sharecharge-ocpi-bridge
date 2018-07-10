import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import authenticate from '../../middleware/authenticate';
import IModules from './interfaces/iModules';
import IConfig from '../../interfaces/iConfig';

export class Modules {

    router: Router;

    uri: string;

    constructor(private config: IConfig) {
        this.router = Router();
        this.uri = this.config.cpo.modules;
    }
    
    public createModuleObject(data: IModules): { [key: string]: string } {
        const result = {};
        for (const module of data.endpoints) {
            result[module.identifier] = module.url;
        }
        return result;
    }
    
    public async get(): Promise<IModules> {
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
            throw Error('GET modules: ' + err.message);
        }
    }

    public serve(): Router {
        this.router.get('/', authenticate, async (req: Request, res: Response) => {
            res.send(this.config.msp.modules);
        });
        return this.router;
    }
}