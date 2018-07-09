import { send } from '../../services/send';
import IVersions from './interfaces/IVersions';
import { config } from '../../../config/config';

export class Versions {

    constructor() {
    }

    public findUrl(versions: IVersions[]): string {
        // select IVersion object that matches config version
        const version = versions.filter(v => v.version === config.version);
        return version[0].url;
    }

    public async get(): Promise<IVersions[]> {
        try {
            const uri = config.host + 'versions';
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

}