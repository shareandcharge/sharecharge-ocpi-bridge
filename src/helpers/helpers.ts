import { v4 } from 'uuid';
import IModules from '../ocpi/2.1.1/interfaces/iModules';
import IVersions from '../ocpi/2.1.1/interfaces/IVersions';
import * as ConfigStore from 'configstore';

export default class Helpers {

    static generateUUID(): string {
        return v4();
    }

    static getUrlByVersion(versions: IVersions[], version: string): string {
        // select IVersion object that matches config version
        const found = versions.filter(v => v.version === version);
        return found[0].url;
    }

    static getEndpointByIdentifier(modules: IModules['endpoints'], identifier: string): string {
        const endpoint = modules.filter(mod => mod.identifier === identifier).map(mod => mod.url);
        return endpoint[0];
    }

    static reverseLocationLookup(config: ConfigStore, id: string): string {
        const locations = config.get('locations');
        for (const [scId, locId] of Object.entries(locations)) {
            if (locId === id) {
                return scId;
            }
        }
    }

}