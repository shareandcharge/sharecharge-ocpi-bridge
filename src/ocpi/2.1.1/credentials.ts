import { send } from '../../services/send';
import ICredentials from './interfaces/iCredentials';
import IConfig from '../../interfaces/iConfig';

const config: IConfig = require('../../../config/config.json');

export class Credentials {

    constructor() {}

    /**
     * Get credentials of Charge Point Operator
     * @returns TOKEN_C
     */
    public async get(): Promise<ICredentials> {
        try {
            const uri = config.cpo.host + config.version + '/credentials';
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
        try {
            const uri = config.cpo.host + config.version + '/credentials';
            const result = await send('POST', uri, config.msp.credentials);
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