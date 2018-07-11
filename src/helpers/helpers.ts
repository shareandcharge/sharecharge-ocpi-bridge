import { v4 } from 'uuid';
import IModules from '../ocpi/2.1.1/interfaces/iModules';

export default class Helpers {

    static generateUUID(): string {
        return v4();
    }

    static getEndpoint(modules: IModules['endpoints'], identifier: string): string {
        const endpoint = modules.filter(mod => mod.identifier === identifier).map(mod => mod.url);
        if (endpoint[0]) {
            return endpoint[0];
        } else {
            throw Error(`No endpoint found for ${identifier} module!`);
        }
    }

}