import { Arguments } from "yargs";
import { Answers, prompt } from 'inquirer';
import * as ConfigStore from 'configstore';
import { OCPI } from "../../src/services/ocpi";
import IToken from "../../src/ocpi/2.1.1/interfaces/iToken";
import Helpers from "../../src/helpers/helpers";

const config = new ConfigStore('ocpi');

export default class TokensService {
    
    static get ocpi(): OCPI {
        const ocpi = OCPI.getInstance(config);
        return ocpi;
    }

    static async get(args: Arguments): Promise<void> {
        const result = await TokensService.ocpi.tokens.get(args.uid);
        console.log(JSON.stringify(result, null, 2));
    }

    static async put(): Promise<void> {
        console.log('Enter token details:');
        const answer: Answers = await prompt([
            {
                type: 'input',
                name: 'controller',
                message: 'Enter driver address:',
            }
        ]);
        const token = Helpers.generateToken(config, answer.controller);
        await TokensService.ocpi.tokens.put(token);
        config.set(`msp.token.${answer.controller}`, token);
        console.log(`New driver access token: ${token.uid}`);
    }

}