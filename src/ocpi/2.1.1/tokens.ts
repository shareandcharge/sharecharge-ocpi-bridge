import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import IToken from './interfaces/iToken';
// import authenticate from '../../middleware/authenticate';
import Helpers from '../../helpers/helpers';
// import IResponse from './interfaces/iResponse';
import send from '../../services/send';

export class Tokens {

    router: Router;
    
    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    private createUri(uid: string): string {
        const country = this.config.get('msp.credentials.country_code');
        const party = this.config.get('msp.credentials.party_id');
        return urlJoin(
            Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'tokens'), `/${country}/${party}/${uid}`
        );
    }

    public async get(uid: string): Promise<IToken> {
        try {
            const result = await send({
                method: 'GET',
                uri: this.createUri(uid),
                headers: this.config.get('cpo.headers'),
            });
            return result;
        } catch (err) {
            throw Error(`GET tokens: ${err.message}`);
        }
    }

    public async put(token: IToken): Promise<void> {
        try {
            const result = await send({
                method: 'PUT', 
                uri: this.createUri(token.uid),
                headers: this.config.get('cpo.headers'),
                body: token,
            });
            return result;
        } catch (err) {
            throw Error(`PUT tokens: ${err.message}`);
        }
    }
    
}