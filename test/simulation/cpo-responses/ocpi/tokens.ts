import * as nock from 'nock';
import * as ConfigStore from 'configstore';
import { ocpiSuccess, ocpiError } from '../services/ocpiResponse';
import IToken from '../../../../src/ocpi/2.1.1/interfaces/iToken';

export class Tokens {

    endpoint: string;
    host: any;

    countryCode: string;
    partyId: string;

    constructor(config: ConfigStore) {
        this.host = nock(config.get('cpo.modules'), {
            reqheaders: config.get('cpo.headers')
        });
        this.countryCode = config.get('msp.credentials.country_code');
        this.partyId = config.get('msp.credentials.party_id');
        this.endpoint = `/tokens/${this.countryCode}/${this.partyId}/`;
    }

    public getSuccess(uid: string): void {
        this.host.get(this.endpoint + uid)
            .reply(200, ocpiSuccess(<IToken>{
                "uid": "012345678",
                "type": "RFID",
                "auth_id": "DE8ACC12E46L89",
                "visual_number": "DF000-2001-8999",
                "issuer": "TheNewMotion",
                "valid": true,
                "whitelist": "ALWAYS",
                "last_updated": new Date()
              }));
    }

    public getOcpiError(uid: string): void {
        this.host.get(this.endpoint + uid).reply(200, ocpiError());
    }

    public getHttpError(uid: string): void {
        this.host.get(this.endpoint + uid).reply(400, 'Bad request');
    }

    public putSuccess(token: IToken): void {
        this.host.put(this.endpoint + token.uid, token).reply(200, ocpiSuccess());
    }

    public putOcpiError(token: IToken): void {
        this.host.put(this.endpoint + token.uid, token).reply(200, ocpiError());
    }

    public putHttpError(token: IToken): void {
        this.host.put(this.endpoint + token.uid, token).reply(500, 'Internal server error');
    }


}