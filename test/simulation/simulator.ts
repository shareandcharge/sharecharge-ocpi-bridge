import { Versions } from './ocpi/versions';
import { Modules } from './ocpi/modules';
import { Credentials } from './ocpi/credentials';

export class Simulator {

    versions: Versions;
    modules: Modules;
    credentials: Credentials;

    constructor() {
        this.versions = new Versions();
        this.modules = new Modules();
        this.credentials = new Credentials();
    }

}