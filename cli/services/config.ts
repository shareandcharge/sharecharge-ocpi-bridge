import { Arguments } from "yargs";
import * as configStore from 'configstore';

const config = new configStore('ocpi');

export default class ConfigService {

    static get(argv: Arguments): void {
        if (!argv.key) {
            console.log(JSON.stringify(config.all, null, 2));
        } else {
            console.log(JSON.stringify(config.get(argv.key), null, 2));
        }
    }

    static set(argv: Arguments): void {

    }

}