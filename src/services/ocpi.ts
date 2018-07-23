import { Server } from 'http';
import * as ConfigStore from 'configstore';
import { app, port } from './server';
import { Versions } from '../ocpi/2.1.1/versions';
import { Modules } from '../ocpi/2.1.1/modules';
import { Credentials } from '../ocpi/2.1.1/credentials';
import { Tariffs } from '../ocpi/2.1.1/tariffs';
import { Locations } from '../ocpi/2.1.1/locations';
import { Tokens } from '../ocpi/2.1.1/tokens';
import { Sessions } from '../ocpi/2.1.1/sessions';
import { Commands } from '../ocpi/2.1.1/commands';
import { EventEmitter } from 'events';
import { CDRs } from '../ocpi/2.1.1/cdrs';

export const push = new EventEmitter();

export class OCPI {

    private server: Server;

    constructor(public config: ConfigStore,
                public versions: Versions,
                public modules: Modules,
                public credentials: Credentials,
                public tariffs: Tariffs,
                public locations: Locations,
                public tokens: Tokens,
                public sessions: Sessions,
                public commands: Commands,
                public cdrs: CDRs) {
                    this.createRoutes();
    }

    private createRoutes(): void {
        app.use('/ocpi/emsp/', this.versions.serve());
        app.use(`/ocpi/emsp/${this.config.all.version}/`, 
            this.modules.serve(),
            this.credentials.serve(),
            this.sessions.serve(),
            this.commands.serve(),
            this.cdrs.serve()
        );
    }
    
    public startServer(callback = () => {}): void {
        this.server = app.listen(port, callback);
    }

    public stopServer(): void {
        this.server.close();
    }

    private static instance: OCPI;

    public static getInstance(config: ConfigStore): OCPI {
        const credentials = new Credentials(config);
        const versions = new Versions(config);
        const modules = new Modules(config);
        const tariffs = new Tariffs(config);
        const locations = new Locations(config);
        const tokens = new Tokens(config);
        const sessions = new Sessions(config, push);
        const commands = new Commands(config, push);
        const cdrs = new CDRs(config, push);
        OCPI.instance = new OCPI(config, versions, modules, credentials, tariffs, locations, tokens, sessions, commands, cdrs);
        return OCPI.instance;
    }

}