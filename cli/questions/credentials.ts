import { Questions } from "inquirer";

export const credentials: Questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter your organization name:',
    },
    {
        type: 'input',
        name: 'country_code',
        message: 'Enter country code:',
    },
    {
        type: 'input',
        name: 'party_id',
        message: 'Enter party identifier:',
    },
    {
        type: 'input',
        name: 'url',
        message: 'Enter your eMSP server address:',
    },
]