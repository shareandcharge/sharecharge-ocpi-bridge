import * as ConfigStore from 'configstore';
import { Versions } from './ocpi/versions';
import { Modules } from './ocpi/modules';
import { Credentials } from './ocpi/credentials';
import { Tariffs } from './ocpi/tariffs';
import { Locations } from './ocpi/locations';

export class Simulator {

    versions: Versions;
    modules: Modules;
    credentials: Credentials;
    tariffs: Tariffs;
    locations: Locations;

    constructor(config: ConfigStore) {
        this.versions = new Versions(config);
        this.modules = new Modules(config);
        this.credentials = new Credentials(config);
        this.locations = new Locations(config);
        this.tariffs = new Tariffs(config);
    }

}