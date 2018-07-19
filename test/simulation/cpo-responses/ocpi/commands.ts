import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import IStartSession from '../../../../src/ocpi/2.1.1/interfaces/iStartSession';
import { token } from '../../../config/token';

export class Commands {

    endpoint: string;
    host: any;

    constructor(config: ConfigStore) {
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
        this.endpoint = `/commands/`;
    }

    public startSuccess(location_id: string): void {
        this.host.get(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/',
            token,
            location_id
        }).reply(200, ocpiSuccess('ACCEPTED'));
    }

    public startRejected(location_id: string): void {
        this.host.post(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/',
            token,
            location_id
        }).reply(200, ocpiSuccess('REJECTED'));
    }

    public startOcpiError(location_id: string): void {
        this.host.get(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/',
            token,
            location_id
        }).reply(200, ocpiError());
    }

    public startHttpError(location_id: string): void {
        this.host.get(this.endpoint + 'START_SESSION', <IStartSession>{
            response_url: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/',
            token,
            location_id
        }).reply(400, 'Bad request');
    }

    public stopSuccess(): void {
        this.host.put(this.endpoint).reply(200, ocpiSuccess());
    }

    public stopOcpiError(): void {
        this.host.put(this.endpoint).reply(200, ocpiError());
    }

    public stopHttpError(): void {
        this.host.put(this.endpoint).reply(500, 'Internal server error');
    }


}