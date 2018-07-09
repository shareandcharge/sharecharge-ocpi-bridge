import { send } from '../../services/send';
import IVersions from './interfaces/IVersions';
import { config } from '../../../config/config';

export class Versions {

    constructor() {
    }

    private findUrl(versions: IVersions[]): string {
        // select IVersion object that matches config version
        const version = versions.filter(v => v.version === config.version);
        return version[0].url;
    }

    public async pull(): Promise<string> {
        try {
            const uri = config.host + 'versions';
            const result = await send('GET', uri);
            if (result.status_code === 1000) {
                const versions: IVersions[] = result.data;
                try {
                    return this.findUrl(versions);
                } catch (err) {
                    throw Error(`Unable to find URL for ${config.version}: ${versions}`);
                }
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error('PULL versions: ' + err.message);
        }
    }

}