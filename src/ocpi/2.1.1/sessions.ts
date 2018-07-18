import { getConfigDir } from '@motionwerk/sharecharge-common/dist/config';
import { Router, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { Subject } from 'rxjs';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import Helpers from '../../helpers/helpers';
import send from '../../services/send';
import ISession from './interfaces/iSession';
import authenticate from '../../middleware/authenticate';
import IResponse from './interfaces/iResponse';

export class Sessions {

    router: Router;

    complete = new Subject<ISession>();
    complete$ = this.complete.asObservable();

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

    public serve(): Router {
        this.router.get('/sessions/:country/:party/:id', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            try {
                const contents = readFileSync(getConfigDir() + `sessions/${req.params.id}.json`).toString();
                res.send(<IResponse>{
                    status_code: 1000,
                    data: JSON.parse(contents),
                    timestamp: new Date()
                });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 3000,
                    status_message: 'Unable to find session with id ' + req.query.id,
                    timestamp: new Date()
                });
            }
        });
        this.router.put('/sessions', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            try {
                const session: ISession = req.body;
                writeFileSync(getConfigDir() + `sessions/${session.id}.json`, JSON.stringify(session));
                if (session.status === 'COMPLETE') {
                    this.complete.next(session);
                }
                res.send(<IResponse>{
                    status_code: 1000,
                    status_message: 'Success',
                    timestamp: new Date()
                });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 3000,
                    status_message: 'Unable to store session',
                    timestamp: new Date()
                });
            }
        });
        this.router.patch('/sessions/:country/:party/:id', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            try {
                const filename = getConfigDir() + `sessions/${req.params.id}.json`;
                const sessionOnDisk: ISession = JSON.parse(readFileSync(filename).toString());
                Object.keys(req.body).forEach(key => {
                    sessionOnDisk[key] = req.body[key];
                });
                if (sessionOnDisk.status === 'COMPLETE') {
                    this.complete.next(sessionOnDisk);
                }
                writeFileSync(filename, sessionOnDisk);
                res.send(<IResponse>{
                    status_code: 1000,
                    status_message: 'Success',
                    timestamp: new Date()
                });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 3000,
                    status_message: 'Unable to update session',
                    timestamp: new Date()
                });
            }
        });
        return this.router;
    }

}