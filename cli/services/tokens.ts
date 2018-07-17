import { Arguments } from "yargs";
import { Answers, prompt } from 'inquirer';
import * as ConfigStore from 'configstore';
import { OCPI } from "../../src/services/ocpi";
import IToken from "../../src/ocpi/2.1.1/interfaces/iToken";

const config = new ConfigStore('ocpi');
const ocpi = OCPI.getInstance(config);

export default class TokensService {

    static async get(args: Arguments): Promise<void> {
        const result = await ocpi.tokens.get(args.uid);
        console.log(JSON.stringify(result, null, 2));
    }

    static async put(): Promise<void> {
        console.log('Enter token details:');
        const token: Answers = await prompt([
            {
                type: 'input',
                name: 'uid',
                message: 'UID:',
            },
            {
                type: 'input',
                name: 'auth_id',
                message: 'Auth ID (driver eMA ID):'
            },
            {
                type: 'confirm',
                name: 'valid',
                message: 'Is token valid?'
            },
        ]);
        await ocpi.tokens.put(<IToken>{
            uid: token.uid,
            type: 'OTHER',
            auth_id: token.auth_id,
            issuer: config.get('msp.credentials.business_details.name'),
            valid: token.valid,
            whitelist: 'ALWAYS',
            last_updated: new Date()
        });
        config.set('msp.driver_token', token.uid);
        console.log(`New default driver access token: ${token.uid}`);
    }

}