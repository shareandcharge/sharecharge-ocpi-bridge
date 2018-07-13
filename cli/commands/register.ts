import { Arguments } from "yargs";
import * as ConfigStore from 'configstore';
import Config from '../../src/models/config';
import { OCPI } from "../../src/services/ocpi";
// import { Simulator } from '../../test/simulation/cpo-responses/simulator';
import Helpers from "../../src/helpers/helpers";

const config = new ConfigStore('ocpi');

export default async (args: Arguments) => {

    if (!config.get('cpo.headers.Authorization') && !config.get('cpo.versions')) {
        console.log('No Charge Point Operator configured!');
        return;
    }

    const ocpi = OCPI.getInstance(config);
    ocpi.startServer();
    // const simulator = new Simulator(config);

    try {

        // 1. Request GET versions (using TOKEN_A as authentication) and store mutual version's modules endpoint
        
        // simulator.versions.success();
        console.log('Requestion CPO OCPI versions');
        const versions = await ocpi.versions.get();
        const modulesUrl = Helpers.getUrlByVersion(versions, config.get('version'));
        if (modulesUrl) {
            console.log(`Found matching OCPI version: ${config.get('version')}`);
            config.set('cpo.modules', modulesUrl);
        } else {
            throw Error(`Unable to find matching OCPI version from ${config.get('cpo.versions')}!`);
        }

        // 2. Request GET modules (using TOKEN_A as authentication) and store all  

        // simulator.modules.success();
        const modules = await ocpi.modules.get();
        if (modules.endpoints.length) {
            console.log(`Found module endpoints: ${modules.endpoints.map(endpoint => endpoint.identifier).join(' ')}`);
            config.set('cpo.endpoints', modules.endpoints);
        } else {
            throw Error(`Unable to find module endpoints from ${config.get('cpo.modules')}!`);
        }

        // 3. Request POST credentials with generated TOKEN_B
        // 4. Receive GET versions (using TOKEN_B as authentication)
        // 5. Receive GET modules (using TOKEN_B as authentication)
        // 6. Receive POST credentials and store TOKEN_C for authentication

        // simulator.credentials.postSuccess();
        const credentials = await ocpi.credentials.post();

        if (credentials.token) {
            console.log(`Received TOKEN_C: ${credentials.token}`);
            config.set('cpo.headers.Authorization', `Token ${credentials.token}`);
        } else {
            const url = Helpers.getEndpointByIdentifier(config.get('cpo.endpoints'), 'credentials');
            throw Error(`Unable to retrieve TOKEN_C from ${url}`);
        }

        console.log('Registration complete');

    } catch (err) {
        console.log('Error with registration:', err.message);
    }

    ocpi.stopServer();

}