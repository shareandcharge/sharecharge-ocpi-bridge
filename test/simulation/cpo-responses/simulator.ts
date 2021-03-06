import * as ConfigStore from 'configstore';
import { Versions } from './ocpi/versions';
import { Modules } from './ocpi/modules';
import { Credentials } from './ocpi/credentials';
import { Tariffs } from './ocpi/tariffs';
import { Locations } from './ocpi/locations';
import { Tokens } from './ocpi/tokens';
import { Sessions } from './ocpi/sessions';
import { Commands } from './ocpi/commands';
import { CDRs } from './ocpi/cdrs';

export class Simulator {

    versions: Versions;
    modules: Modules;
    credentials: Credentials;
    tariffs: Tariffs;
    locations: Locations;
    tokens: Tokens;
    sessions: Sessions;
    commands: Commands;
    cdrs: CDRs;

    constructor(config: ConfigStore) {
        this.versions = new Versions(config);
        this.modules = new Modules(config);
        this.credentials = new Credentials(config);
        this.locations = new Locations(config);
        this.tariffs = new Tariffs(config);
        this.tokens = new Tokens(config);
        this.sessions = new Sessions(config);
        this.commands = new Commands(config);
        this.cdrs = new CDRs(config);
    }

}