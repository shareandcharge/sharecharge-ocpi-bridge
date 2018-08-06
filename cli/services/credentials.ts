import { Arguments } from "yargs";
import * as ConfigStore from 'configstore';
import { OCPI } from "../../src/services/ocpi";

const config = new ConfigStore('ocpi');

export default class CredentialsService {

    static get ocpi(): OCPI {
        const ocpi = OCPI.getInstance(config);
        CredentialsService.ocpi.startServer();
        return ocpi;
    }
    
    static async get(): Promise<void> {
        const result = await CredentialsService.ocpi.credentials.get();
        console.log(JSON.stringify(result, null, 2));
    }
    
    static async post(): Promise<void> {
        const result = await CredentialsService.ocpi.credentials.post();
        console.log(JSON.stringify(result, null, 2));
        CredentialsService.ocpi.stopServer();
    }

}