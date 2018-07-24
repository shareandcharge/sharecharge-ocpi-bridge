import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import Helpers from '../../helpers/helpers';
import send from '../../services/send';
import IStartSession from './interfaces/iStartSession';
import IStopSession from './interfaces/iStopSession';
import ICommandResponse from './interfaces/iCommandResponse';
import authenticate from '../../middleware/authenticate';
import IResponse from './interfaces/iResponse';
import { EventEmitter } from 'events';

export class Commands {

    router: Router;

    constructor(private config: ConfigStore, public push: EventEmitter) {
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

    public async startSession(location_id: string, controller: string, req_id: string): Promise<ICommandResponse> {
        try {
            const result = await send({
                method: 'POST',
                uri: this.createUri('START_SESSION'),
                headers: this.config.get('cpo.headers'),
                body: <IStartSession>{
                    response_url: this.createResponseUri('START_SESSION', req_id),
                    token: this.config.get(`msp.tokens.${controller}`),
                    location_id
                    // evse_uid
                }
            });
            return result;
        } catch (err) {
            throw Error(`POST commands/START_SESSION: ${err.message}`);
        }
    }

    public async stopSession(session_id: string): Promise<ICommandResponse> {
        try {
            const result = await send({
                method: 'POST',
                uri: this.createUri('STOP_SESSION'),
                headers: this.config.get('cpo.headers'),
                body: <IStopSession>{
                    response_url: this.createResponseUri('STOP_SESSION', session_id),
                    session_id
                }
            });
            return result;
        } catch (err) {
            throw Error(`POST commands/STOP_SESSION: ${err.message}`);
        }
    }

    public serve(): Router {
        this.router.post('/commands/START_SESSION/:uid', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            try {
                console.log(`POST /command/START_SESSION/${req.params.uid}`);
                this.push.emit('start', { id: req.params.uid, success: req.body.result === 'ACCEPTED' });
                res.send(<IResponse>{
                    status_code: 1000,
                    timestamp: new Date()
                });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 3000,
                    status_message: err.message,
                    timestamp: new Date()
                });
            }
        });
        this.router.post('/commands/STOP_SESSION/:uid', authenticate(this.config.get('msp.credentials.token')), async (req: Request, res: Response) => {
            try {
                console.log(`POST /command/STOP_SESSION/${req.params.uid}`);
                this.push.emit('stop', { id: req.params.uid, success: req.body.result === 'ACCEPTED' })
                res.send(<IResponse>{
                    status_code: 1000,
                    timestamp: new Date()
                });
            } catch (err) {
                res.send(<IResponse>{
                    status_code: 3000,
                    status_message: err.message,
                    timestamp: new Date()
                });
            }
        });
        return this.router;
    }
    
}