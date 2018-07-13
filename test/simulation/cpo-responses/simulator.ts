import { Versions } from './ocpi/versions';
import { Modules } from './ocpi/modules';
import { Credentials } from './ocpi/credentials';
import Config from '../../../src/models/config';

export class Simulator {

    versions: Versions;
    modules: Modules;
    credentials: Credentials;

    constructor(config: Config) {
        this.versions = new Versions(config);
        this.modules = new Modules(config);
        this.credentials = new Credentials(config);
    }

}