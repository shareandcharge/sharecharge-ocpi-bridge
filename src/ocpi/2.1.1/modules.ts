import { send } from '../../services/send';
import IModules from './interfaces/iModules';
import { config } from '../../../config/config';

export class Modules {

    constructor() {
    }

    async pull(): Promise<IModules> {
        try {
            const uri = config.host;
            const result = await send('GET', uri);
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error('PULL modules: ' + err.message);
        }
    }
}