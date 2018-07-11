import { Answers, prompt } from 'inquirer';
import * as configStore from 'configstore';
import { resolve as resolveUrl } from 'url';
import Helpers from '../../src/helpers/helpers';
import Config from '../../src/models/config';

export default async () => {
    console.log('Initializing Open Charge Point Interface (OCPI) Bridge...');
    const config = new configStore('ocpi', Config.default());
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
    const mspTemp = {
        url: resolveUrl(msp.url, '/ocpi/emsp/versions/'),
        token: Helpers.generateUUID(),
        party_id: msp.party_id,
        country_code: msp.country_code,
        business_details: {
            name: msp.name
        }
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
    const cpoTemp = {
        versions: cpo.url,
        headers: {
            Authorization: `Token ${cpo.token}`
        },
        modules: '',
        endpoints: []
    };
    console.log('\nYour eMSP credentials:\n' + JSON.stringify(mspTemp, null, 4));
    console.log('\nConnected CPO details:\n' + JSON.stringify(cpoTemp, null, 4));
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
            config.set('msp.credentials', mspTemp);
            config.set('cpo', cpoTemp);
            console.log('Saved configuration');
        } catch (err) {
            console.log(`Error updating configuration: ${err.message}`);
            process.exit();       
        }        
    } else {
        process.exit();
    }
}