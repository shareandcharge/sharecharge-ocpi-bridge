import { Answers, prompt } from 'inquirer';
import * as ConfigStore from 'configstore';
import { resolve as resolveUrl } from 'url';
import Helpers from '../../src/helpers/helpers';
import Config from '../../src/models/config';
import IVersions from '../../src/ocpi/2.1.1/interfaces/IVersions';
import IModules from '../../src/ocpi/2.1.1/interfaces/iModules';
import ICredentials from '../../src/ocpi/2.1.1/interfaces/iCredentials';

export default async () => {
    console.log('Initializing Open Charge Point Interface (OCPI) Bridge...');
    console.log('\nYour eMobility Service Provider (eMSP) credentials:');
    const msp: Answers = await prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter your organization name:',
        },
        {
            type: 'input',
            name: 'party_id',
            message: 'Enter the ID for your organization (party ID):',
        },
        {
            type: 'input',
            name: 'country_code',
            message: 'Enter your country code:',
        },
        {
            type: 'input',
            name: 'url',
            message: 'Enter your eMSP server address:',
        },
    ]);
    const mspCredentials: ICredentials = {
        url: resolveUrl(msp.url, '/ocpi/emsp/versions/'),
        token: Helpers.generateUUID(),
        party_id: msp.party_id,
        country_code: msp.country_code,
        business_details: {
            name: msp.name
        }
    };
    const mspVersions: IVersions[] = [{
        version: Config.default.version,
        url: resolveUrl(mspCredentials.url, `/ocpi/emsp/${Config.default.version}/`)
    }];
    const mspModules: IModules = {
        version: Config.default.version,
        endpoints: Config.default.msp.modules.endpoints.map(endpoint => {
            return {
                identifier: endpoint.identifier,
                url: `${msp.url}/ocpi/emsp/${Config.default.version}/${endpoint.identifier}`
            }
        })
    };
    console.log('\nCharge Point Operator (CPO) connection details:');
    const cpo: Answers = await prompt([
        {
            type: 'input',
            name: 'url',
            message: 'Enter the CPO\'s versions endpoint:',
        },
        {
            type: 'input',
            name: 'token',
            message: 'Enter TOKEN_A necessary for authentication:'
        }
    ]);
    const cpoDetails = {
        versions: cpo.url,
        headers: {
            Authorization: `Token ${cpo.token}`
        },
        modules: '',
        endpoints: []
    };
    console.log('\nYour eMSP credentials:\n' + JSON.stringify(mspCredentials, null, 4));
    console.log('\nConnected CPO details:\n' + JSON.stringify(cpoDetails, null, 4));
    console.log('\n');
    const confirm: Answers = await prompt([
        {
            type: 'confirm',
            name: 'save',
            message: 'Save configuration?',
        }
    ]);
    if (confirm.save) {
        try {
            const config = new ConfigStore('ocpi', Config.default);
            config.set('msp.credentials', mspCredentials);
            config.set('msp.versions', mspVersions);
            config.set('msp.modules', mspModules);
            config.set('cpo', cpoDetails);
            console.log('Saved configuration');
        } catch (err) {
            console.log(`Error updating configuration: ${err.message}`);
            process.exit();       
        }        
    } else {
        process.exit();
    }
}