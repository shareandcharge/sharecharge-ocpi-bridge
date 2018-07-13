import * as ConfigStore from 'configstore';
import { Versions } from './ocpi/versions';
import { Modules } from './ocpi/modules';
import { Credentials } from './ocpi/credentials';

export class Simulator {

    versions: Versions;
    modules: Modules;
    credentials: Credentials;

    constructor(config: ConfigStore) {
        this.versions = new Versions(config);
        this.modules = new Modules(config);
        this.credentials = new Credentials(config);
    }

}