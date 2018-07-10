import { Router, Request, Response } from 'express';
import authenticate from '../../middleware/authenticate';
import { send } from '../../services/send';
import IModules from './interfaces/iModules';
import IConfig from '../../interfaces/iConfig';

const config: IConfig = require('../../../config/config.json');

export class Modules {

    router: Router;

    constructor() {
        this.router = Router();
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
            const uri = config.cpo.host + config.version + '/';
            const result = await send('GET', uri);
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
            res.send(config.msp.modules);
        });
        return this.router;
    }
}