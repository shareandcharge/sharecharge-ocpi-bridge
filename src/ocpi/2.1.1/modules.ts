import { send } from '../../services/send';
import IModules from './interfaces/iModules';
import { config } from '../../../config/config';

export class Modules {

    constructor() {
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
            const uri = config.host + config.version + '/';
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
}