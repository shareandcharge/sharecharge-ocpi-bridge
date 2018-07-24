import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import * as request from 'request-promise-native'; 
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import IStartSession from '../../../../src/ocpi/2.1.1/interfaces/iStartSession';
import IStopSession from '../../../../src/ocpi/2.1.1/interfaces/iStopSession';
import IToken from '../../../../src/ocpi/2.1.1/interfaces/iToken';

export class Commands {

    endpoint: string;
    host: any;
    token: IToken;

    constructor(public config: ConfigStore) {
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
        this.endpoint = `/commands/`;
    }

    public startSuccess(location_id: string, controller: string, req_id: string, requestResult: string, confirmResult: string, push = false): void {
        const response_url = 'http://localhost:3001/ocpi/emsp/2.1.1/commands/START_SESSION/' + req_id;
        const req = this.host.post(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url,
            token: this.config.get(`msp.tokens.${controller}`),
            location_id
        }).reply(200, ocpiSuccess({ result: requestResult }));
        if (push) {
            const interval = setInterval(async () => {
                if (req.isDone()) {
                    clearInterval(interval);
                    if (requestResult === 'ACCEPTED') {
                        const result = await request({
                            method: 'POST',
                            uri: response_url,
                            headers: {
                                Authorization: 'Token ' + this.config.get('msp.credentials.token')
                            },
                            body: {
                                result: confirmResult
                            },
                            json: true
                        });
                    }
                }
            }, 500);
        }
    }

    public startOcpiError(location_id: string, controller: string, req_id: string): void {
        this.host.post(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/START_SESSION/' + req_id,
            token: this.config.get(`msp.tokens.${controller}`),
            location_id
        }).reply(200, ocpiError());
    }

    public startHttpError(location_id: string, controller: string, req_id: string): void {
        this.host.post(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/START_SESSION/' + req_id,
            token: this.config.get(`msp.tokens.${controller}`),
            location_id
        }).reply(400, 'Bad request');
    }

    public stopSuccess(session_id: string, requestResult: string, confirmResult: string, push = false): void {
        const response_url = 'http://localhost:3001/ocpi/emsp/2.1.1/commands/STOP_SESSION/' + session_id;
        const req = this.host.post(this.endpoint + 'STOP_SESSION', <IStopSession>{
            response_url,
            session_id
        }).reply(200, ocpiSuccess({ result: requestResult }));
        if (push) {
            const interval = setInterval(async () => {
                if (req.isDone()) {
                    clearInterval(interval);
                    if (requestResult === 'ACCEPTED') {
                        const result = await request({
                            method: 'POST',
                            uri: response_url,
                            headers: {
                                Authorization: 'Token ' + this.config.get('msp.credentials.token')
                            },
                            body: {
                                result: confirmResult
                            },
                            json: true
                        });
                    }
                }
            }, 500);
        }
    }

    public stopOcpiError(session_id: string): void {
        this.host.post(this.endpoint + 'STOP_SESSION', <IStopSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/STOP_SESSION/' + session_id,
            session_id
        }).reply(200, ocpiError());
    }

    public stopHttpError(session_id: string): void {
        this.host.post(this.endpoint + 'STOP_SESSION', <IStopSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/STOP_SESSION/' + session_id,
            session_id
        }).reply(500, 'Internal server error');
    }

}