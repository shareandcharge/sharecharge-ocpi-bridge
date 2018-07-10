import { Server } from 'http';
import { Versions } from '../ocpi/2.1.1/versions';
import { Modules } from '../ocpi/2.1.1/modules';
import { Credentials } from '../ocpi/2.1.1/credentials';
import { app, port } from './server';

export class OCPI {

    server: Server;

    constructor(public versions: Versions,
                public modules: Modules,
                public credentials: Credentials) {
                    this.createRoutes();
    }

    private createRoutes(): void {
        app.use('/ocpi/emsp/', this.versions.serve());
    }
    
    public startServer(): void {
        this.server = app.listen(port);
    }

    public stopServer(): void {
        this.server.close();
    }

    private static instance: OCPI;

    public static getInstance(): OCPI {
        if (!OCPI.instance) {
            const credentials = new Credentials();
            const versions = new Versions();
            const modules = new Modules();
            OCPI.instance = new OCPI(versions, modules, credentials);
        }
        return OCPI.instance;
    }

}