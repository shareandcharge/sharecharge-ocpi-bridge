import * as express from 'express';
import { send } from '../../services/send';
import IVersions from './interfaces/IVersions';
import IConfig from '../../interfaces/iConfig';

const config: IConfig = require('../../../config/config.json');

export class Versions {

    router: express.Router;

    constructor() {
        this.router = express.Router();
    }

    public findUrl(versions: IVersions[]): string {
        // select IVersion object that matches config version
        const version = versions.filter(v => v.version === config.version);
        return version[0].url;
    }

    public async get(): Promise<IVersions[]> {
        try {
            const uri = config.cpo.host + 'versions';
            const result = await send('GET', uri);
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error('GET versions: ' + err.message);
        }
    }

    public serve(): express.Router {
        this.router.get('/versions', async (req, res) => {
            res.send(config.msp.versions);
        });
        return this.router;
    } 

}