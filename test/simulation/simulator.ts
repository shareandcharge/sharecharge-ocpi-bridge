import { Versions } from './ocpi/versions';
import { Modules } from './ocpi/modules';

export class Simulator {

    versions: Versions;
    modules: Modules;

    constructor() {
        this.versions = new Versions();
        this.modules = new Modules();
    }

}