import { Answers, prompt } from 'inquirer';
import Configurer from '../services/configurer';

export default async () => {
    const configurer = new Configurer();
    console.log('Initializing Open Charge Point Interface (OCPI) Bridge...');
    console.log('\nYour eMobility Service Provider (eMSP) credentials:');
    let answers: Answers = await prompt([
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
    const mspConfig = configurer.writeCredentials(answers);
    console.log('\nCharge Point Operator (CPO) connection details:');
    answers = await prompt([
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
    const cpoConfig = configurer.writeCPO(answers);
    console.log('\nYour eMSP credentials:\n' + JSON.stringify(mspConfig, null, 4));
    console.log('\nConnected CPO details:\n' + JSON.stringify(cpoConfig, null, 4));
    console.log('\n');
    answers = await prompt([
        {
            type: 'confirm',
            name: 'save',
            message: 'Write to configuration?',
        }
    ]);
    if (answers.save) {
        try {
            configurer.save();
            console.log('Updated configuration');
        } catch (err) {
            console.log(`Error updating configuration: ${err.message}`);
            process.exit();       
        }        
    } else {
        process.exit();
    }
}