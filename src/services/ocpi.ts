import { Credentials } from '../ocpi/2.1.1/credentials';
import { Versions } from '../ocpi/2.1.1/versions';

export class OCPI {

    constructor(public credentials: Credentials,
                public versions: Versions) {
    }

    private static instance: OCPI;

    public static getInstance(): OCPI {
        if (!OCPI.instance) {
            const credentials = new Credentials();
            const versions = new Versions();
            OCPI.instance = new OCPI(credentials, versions);
        }
        return OCPI.instance;
    }

}