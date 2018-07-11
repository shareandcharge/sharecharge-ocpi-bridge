import { Server } from 'http';
import { app, port } from './server';
import { Versions } from '../ocpi/2.1.1/versions';
import { Modules } from '../ocpi/2.1.1/modules';
import { Credentials } from '../ocpi/2.1.1/credentials';
import Config from '../models/config';

export class OCPI {

    private server: Server;

    constructor(public config: Config,
                public versions: Versions,
                public modules: Modules,
                public credentials: Credentials) {
                    this.createRoutes();
    }

    private createRoutes(): void {
        app.use('/ocpi/emsp/', this.versions.serve());
        app.use(`/ocpi/emsp/${this.config.version}/`, 
            this.modules.serve(),
            this.credentials.serve()
        );
    }
    
    public startServer(callback = () => {}): void {
        this.server = app.listen(port, callback);
    }

    public stopServer(): void {
        this.server.close();
    }

    private static instance: OCPI;

    public static getInstance(config: Config): OCPI {
        const credentials = new Credentials(config);
        const versions = new Versions(config);
        const modules = new Modules(config);
        OCPI.instance = new OCPI(config, versions, modules, credentials);
        return OCPI.instance;
    }

}