import { Arguments } from "yargs";
import * as configStore from 'configstore';

const config = new configStore('ocpi');

export default class ConfigService {

    static get(argv: Arguments): void {
        console.log(JSON.stringify(config.all, null, 2));
    }

    static set(argv: Arguments): void {

    }

}