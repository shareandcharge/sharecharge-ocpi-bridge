import { send } from '../../services/send';
import { config } from '../../../config/config';
import ICredentials from './interfaces/iCredentials';

export class Credentials {

    constructor() {}

    public async get(): Promise<ICredentials> {
        const uri = config.host + config.version + '/credentials';
        try {
            const result = await send('GET', uri);
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error(`GET credentials: ${err.message}`);
        }
    }

    public async post() {}
    
}