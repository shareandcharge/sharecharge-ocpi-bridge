import { Arguments } from "yargs";
import * as ConfigStore from 'configstore';
import { OCPI } from "../../src/services/ocpi";

const config = new ConfigStore('ocpi');
const ocpi = OCPI.getInstance(config);

export default class CredentialsService {
    
    static async get(): Promise<void> {
        const result = await ocpi.credentials.get();
        console.log(JSON.stringify(result, null, 2));
    }
    
    static async post(): Promise<void> {
        ocpi.startServer();
        const result = await ocpi.credentials.post();
        console.log(JSON.stringify(result, null, 2));
        ocpi.stopServer();
    }

}