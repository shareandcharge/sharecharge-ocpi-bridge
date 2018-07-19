import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import IToken from './interfaces/iToken';
// import authenticate from '../../middleware/authenticate';
import Helpers from '../../helpers/helpers';
// import IResponse from './interfaces/iResponse';
import send from '../../services/send';
import IStartSession from './interfaces/iStartSession';
import IStopSession from './interfaces/iStopSession';
import ICommandResponse from './interfaces/iCommandResponse';
import authenticate from '../../middleware/authenticate';
import { Subject } from 'rxjs';

export class Commands {

    router: Router;

    started = new Subject<{ id: string, success: boolean }>();
    started$ = this.started.asObservable();

    stopped = new Subject<{ id: string, success: boolean }>();
    stopped$ = this.stopped.asObservable();

    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    private createUri(cmd: 'START_SESSION' | 'STOP_SESSION'): string {
        return urlJoin(
            Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'commands'), cmd
        );
    }

    private createResponseUri(cmd: 'START_SESSION' | 'STOP_SESSION', uid: string): string {
        return urlJoin(
            Helpers.getEndpointByIdentifier(this.config.get('msp.modules.endpoints'), 'commands'), `${cmd}/${uid}`
        );
    }

    public async startSession(location_id: string, req_id: string): Promise<ICommandResponse> {
        try {
            const result = await send({
                method: 'POST',
                uri: this.createUri('START_SESSION'),
                headers: this.config.get('cpo.headers'),
                body: <IStartSession>{
                    response_url: this.createResponseUri('START_SESSION', req_id),
                    token: this.config.get('msp.token'),
                    location_id
                    // evse_uid
                }
            });
            return result;
        } catch (err) {
            throw Error(`POST commands/START_SESSION: ${err.message}`);
        }
    }

    public async stopSession(session_id: string, req_id: string): Promise<ICommandResponse> {
        try {
            const result = await send({
                method: 'POST',
                uri: this.createUri('STOP_SESSION'),
                headers: this.config.get('cpo.headers'),
                body: <IStopSession>{
                    response_url: this.createResponseUri('STOP_SESSION', req_id),
                    session_id
                }
            });
            return result;
        } catch (err) {
            throw Error(`POST commands/STOP_SESSION: ${err.message}`);
        }
    }

    public serve(): Router {
        this.router.post('/command/START_SESSION/:uid', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            if (req.body === 'ACCEPTED') {
                this.started.next({ id: req.params.uid, success: true });
            } else {
                this.started.next({ id: req.params.uid, success: false });
            }
        });
        this.router.post('/command/STOP_SESSION/:uid', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            if (req.body === 'ACCEPTED') {
                this.stopped.next({ id: req.params.uid, success: true });
            } else {
                this.stopped.next({ id: req.params.uid, success: false });
            }
        });
        return this.router;
    }
    
}