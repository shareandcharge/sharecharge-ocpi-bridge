import { Credentials } from './2.1.1/credentials';
import { Versions } from './2.1.1/versions';

export class Modules {

    constructor(public credentials: Credentials,
                public versions: Versions) {
    }

    private static instance: Modules;

    public static getInstance(): Modules {
        if (!Modules.instance) {
            const credentials = new Credentials();
            const versions = new Versions();
            Modules.instance = new Modules(credentials, versions);
        }
        return Modules.instance;
    }

}