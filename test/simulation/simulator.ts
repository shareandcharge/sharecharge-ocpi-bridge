import { Versions } from './ocpi/versions';
import { Modules } from './ocpi/modules';
import { Credentials } from './ocpi/credentials';
import IConfig from '../../src/interfaces/iConfig';

export class Simulator {

    versions: Versions;
    modules: Modules;
    credentials: Credentials;

    constructor(config: IConfig) {
        this.versions = new Versions(config);
        this.modules = new Modules(config);
        this.credentials = new Credentials(config);
    }

}