import { getConfigDir } from '@motionwerk/sharecharge-common/dist/config';
import { Router, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import Helpers from '../../helpers/helpers';
import send from '../../services/send';
import ISession from './interfaces/iSession';
import authenticate from '../../middleware/authenticate';
import IResponse from './interfaces/iResponse';
import { EventEmitter } from 'events';
import ICDR from './interfaces/iCDR';

export class CDRs {

    router: Router;

    constructor(private config: ConfigStore, public push: EventEmitter) {
        this.router = Router();
    }

    public async get(): Promise<ICDR[]> {
        try {
            const result = await send({
                method: 'GET', 
                uri: Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'cdrs'),
                headers: this.config.get('cpo.headers'),
            });
            return result;
        } catch (err) {
            throw Error('GET cdrs: ' + err.message);
        }
    }

    public serve(): Router {
        return this.router;
    }

}