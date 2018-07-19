import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import * as urlJoin from 'url-join';
import IToken from './interfaces/iToken';
// import authenticate from '../../middleware/authenticate';
import Helpers from '../../helpers/helpers';
// import IResponse from './interfaces/iResponse';
import send from '../../services/send';
import IStartSession from './interfaces/iStartSession';

export class Commands {

    router: Router;
    
    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    private createUri(cmd: 'START_SESSION' | 'STOP_SESSION'): string {
        return urlJoin(
            Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'commands'), cmd
        )
    }

    public async startSession(location_id: string): Promise<boolean> {
        try {
            const result = await send({
                method: 'POST',
                uri: this.createUri('START_SESSION'),
                headers: this.config.get('cpo.headers'),
                body: <IStartSession>{
                    response_url: Helpers.getEndpointByIdentifier(this.config.get('msp.modules.endpoints'), 'commands'),
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
    
}