import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import IStartSession from '../../../../src/ocpi/2.1.1/interfaces/iStartSession';
import IStopSession from '../../../../src/ocpi/2.1.1/interfaces/iStopSession';
import IToken from '../../../../src/ocpi/2.1.1/interfaces/iToken';

export class Commands {

    endpoint: string;
    host: any;
    token: IToken;

    constructor(config: ConfigStore) {
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
        this.endpoint = `/commands/`;
        this.token = config.get('msp.token');
    }

    public startSuccess(location_id: string, req_id: string): void {
        this.host.post(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/START_SESSION/' + req_id,
            token: this.token,
            location_id
        }).reply(200, ocpiSuccess({ result: 'ACCEPTED' }));
    }

    public startOcpiError(location_id: string, req_id: string): void {
        this.host.post(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/START_SESSION/' + req_id,
            token: this.token,
            location_id
        }).reply(200, ocpiError());
    }

    public startHttpError(location_id: string, req_id: string): void {
        this.host.post(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/START_SESSION/' + req_id,
            token: this.token,
            location_id
        }).reply(400, 'Bad request');
    }

    public stopSuccess(session_id: string, req_id: string): void {
        this.host.post(this.endpoint + 'STOP_SESSION', <IStopSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/STOP_SESSION/' + req_id,
            session_id
        }).reply(200, ocpiSuccess({ result: 'REJECTED' }));
    }

    public stopOcpiError(session_id: string, req_id: string): void {
        this.host.post(this.endpoint + 'STOP_SESSION', <IStopSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/STOP_SESSION/' + req_id,
            session_id
        }).reply(200, ocpiError());
    }

    public stopHttpError(session_id: string, req_id: string): void {
        this.host.post(this.endpoint + 'STOP_SESSION', <IStopSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/STOP_SESSION/' + req_id,
            session_id
        }).reply(500, 'Internal server error');
    }

}