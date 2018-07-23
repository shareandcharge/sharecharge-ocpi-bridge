import { getConfigDir } from '@motionwerk/sharecharge-common/dist/config';
import { Router, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import { URL } from 'url';
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
        this.router.get('/cdrs/:id', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            res.send(<IResponse>{
                status_code: 3000,
                status_message: 'CDRs not currently stored on the Share & Charge core client',
                timestamp: new Date()
            });
        });
        this.router.post('/cdrs', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            try {
                const cdr: ICDR = req.body;
                const endpoint = Helpers.getEndpointByIdentifier(this.config.get('msp.modules.endpoints'), 'cdrs');
                const location = new URL(urlJoin(endpoint, cdr.id))
                res
                    .set('Location', location.pathname)
                    .send(<IResponse>{
                        status_code: 1000,
                        timestamp: new Date()
                    });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 2000,
                    status_message: err.message,
                    timestamp: new Date()
                })
            }
        });
        return this.router;
    }

}