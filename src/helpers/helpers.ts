import { v4 } from 'uuid';
import IModules from '../ocpi/2.1.1/interfaces/iModules';
import IVersions from '../ocpi/2.1.1/interfaces/IVersions';
import * as ConfigStore from 'configstore';
import IToken from '../ocpi/2.1.1/interfaces/iToken';
import ICredentials from '../ocpi/2.1.1/interfaces/iCredentials';

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

    static generateToken(credentials: ICredentials): IToken {
        const country = credentials.country_code;
        const party = credentials.party_id;
        const eMA = Math.random().toString(36).substr(2, 8).toUpperCase();
        const auth_id = `${country}-${party}-C${eMA}`;
        return {
            uid: v4(),
            type: 'OTHER',
            auth_id,
            issuer: 'Share&Charge',
            valid: true,
            whitelist: 'ALWAYS',
            last_updated: new Date()
        }
    }

}