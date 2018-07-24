import { v4 } from 'uuid';
import IModules from '../ocpi/2.1.1/interfaces/iModules';
import IVersions from '../ocpi/2.1.1/interfaces/IVersions';
import * as ConfigStore from 'configstore';
import { join as pathJoin } from 'path';
import IToken from '../ocpi/2.1.1/interfaces/iToken';
import { ISession, getConfigDir, prepareConfigLocation } from '@motionwerk/sharecharge-common/dist/common';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import ICDR from '../ocpi/2.1.1/interfaces/iCDR';

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

    static reverseAuthLookup(config: ConfigStore, auth_id: string): string {
        const tokens: { [key: string]: IToken } = config.get('msp.tokens');
        for (const [controller, token] of Object.entries(tokens)) {
            if (token.auth_id === auth_id) {
                return controller;
            }
        }
    }

    static generateToken(config: ConfigStore, controller: string): IToken {
        const country = config.get('msp.credentials.country_code');
        const party = config.get('msp.credentials.party_id');
        const eMA = Math.random().toString(36).substr(2, 8).toUpperCase();
        const auth_id = `${country}-${party}-C${eMA}`;
        const token: IToken = {
            uid: v4(),
            type: 'OTHER',
            auth_id,
            issuer: 'Share&Charge',
            valid: true,
            whitelist: 'ALWAYS',
            last_updated: new Date()
        }
        config.set(`msp.tokens.${controller}`, token);
        return token;
    }

    static writeSession(auth_id: string, session: ISession) {
        try {
            const path = pathJoin(getConfigDir(), 'sessions', `${auth_id}.json`);
            writeFileSync(path, JSON.stringify(session, null, 2));
        } catch (err) {
            prepareConfigLocation();
            this.writeSession(auth_id, session);
        }
    }

    static readSession(auth_id: string): ISession {
        const path = pathJoin(getConfigDir(), 'sessions', `${auth_id}.json`);
        return JSON.parse(readFileSync(path).toString());
    }

}