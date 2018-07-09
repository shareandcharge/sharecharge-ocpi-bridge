import { Versions } from '../ocpi/2.1.1/versions';
import { Modules } from '../ocpi/2.1.1/modules';
import { Credentials } from '../ocpi/2.1.1/credentials';

export class OCPI {

    constructor(public versions: Versions,
                public modules: Modules,
                public credentials: Credentials) {
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