import { Arguments } from 'yargs';
import { Answers, prompt } from 'inquirer';
import Configurer from '../helpers/configurer';
import { credentials } from '../questions/credentials';

export default async (args: Arguments) => {

    const configurer = new Configurer();

    console.log('Initializing Open Charge Point Interface (OCPI) Bridge...');
    let answers: Answers = await prompt(credentials);  
    let temp = configurer.writeCredentials(answers);

    console.log('Your eMSP credentials:\n', JSON.stringify(temp, null, 2));
    
    answers = await prompt([
        {
            type: 'confirm',
            name: 'save',
            message: 'Write credentials to configuration?',
        }
    ]);

    console.log(answers);

    if (answers.save) {
        try {
            configurer.save();
            console.log('Updated configuration');
        } catch (err) {
            console.log(`Error updating configuration: ${err.message}`);       
        }        
    } else {
        console.log('Exiting');
        process.exit();
    }
}