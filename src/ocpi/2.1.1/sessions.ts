import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import Helpers from '../../helpers/helpers';
import send from '../../services/send';
import ISession from './interfaces/iSession';

export class Sessions {

    router: Router;

    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    private createUri(): string {
        return urlJoin(
            Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'sessions'), `?date_from=${new Date(0)}`
        );
    }

    public async get(): Promise<ISession[]> {
        console.log(this.createUri());
        try {
            const result = await send({
                method: 'GET', 
                uri: this.createUri(),
                headers: this.config.get('cpo.headers'),
            });
            return result;
        } catch (err) {
            throw Error('GET sessions: ' + err.message);
        }
    }

}