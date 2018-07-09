import { send } from '../../services/send';
import { config } from '../../../config/config';
import ICredentials from './interfaces/iCredentials';
import { generateUUID } from '../../helpers/toolKit';

export class Credentials {

    constructor() {}

    /**
     * Get credentials of Charge Point Operator
     * @returns TOKEN_C
     */
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

    /**
     * Post our eMobility Service Provider credentials to Charge Point Operator
     * @param TOKEN_B
     * @returns TOKEN_C
     */
    public async post(): Promise<ICredentials> {
        const uri = config.host + config.version + '/credentials';
        config.credentials.token = generateUUID();
        try {
            const result = await send('POST', uri, config.credentials);
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error(`POST credentials: ${err.message}`);
        }
    }
    
}