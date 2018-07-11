import { Arguments } from "yargs";
import IConfig from '../../src/interfaces/iConfig';
import { OCPI } from "../../src/services/ocpi";
import { Simulator } from '../../test/simulation/simulator';
import Helpers from "../../src/helpers/helpers";

const config: IConfig = require('../../test/config/config');

export default async (args: Arguments) => {

    // use simulator if test flag present
    // return if not yet initialised

    const ocpi = OCPI.getInstance(config);
    ocpi.startServer();
    const simulator = new Simulator(config);

    try {

        // 1. Request GET versions (using TOKEN_A as authentication) and store mutual version's modules endpoint
        simulator.versions.success();
        const versions = await ocpi.versions.get();
        const modulesUrl = Helpers.getUrlByVersion(versions, config.version);
        if (modulesUrl) {
            console.log(`Found matching OCPI version: ${config.version}`);
            // write to config
        } else {
            throw Error(`Unable to find matching OCPI version from ${config.cpo.versions}!`);
        }

        // 2. Request GET modules (using TOKEN_A as authentication) and store all  

        simulator.modules.success();
        const modules = await ocpi.modules.get();
        if (modules.endpoints.length) {
            console.log(`Found module endpoints: ${modules.endpoints.map(endpoint => endpoint.identifier).join(' ')}`);
            // write to config
        } else {
            throw Error(`Unable to find module endpoints from ${config.cpo.modules}!`);
        }

        // 3. Request POST credentials with generated TOKEN_B
        // 4. Receive GET versions (using TOKEN_B as authentication)
        // 5. Receive GET modules (using TOKEN_B as authentication)
        // 6. Receive POST credentials and store TOKEN_C for authentication

        simulator.credentials.postSuccess();
        const credentials = await ocpi.credentials.post();

        if (credentials.token) {
            console.log(`Received TOKEN_C: ${credentials.token}`);
            // write to config (auth header)
        } else {
            throw Error(`Could not find TOKEN_C from ${ocpi.credentials.uri}`);
        }

        console.log('Completed registration');


    } catch (err) {
        console.log('Error with registration:', err.message);
    }

    ocpi.stopServer();

}