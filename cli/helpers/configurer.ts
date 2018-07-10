import { writeFileSync } from 'fs';
import { join } from 'path';
import { resolve } from 'url';
import { v4 } from 'uuid';
import { Answers } from 'inquirer';
import IConfig from '../../src/interfaces/iConfig';
import ICredentials from '../../src/ocpi/2.1.1/interfaces/iCredentials';

const config: IConfig = require('../../config/config.json');

export default class Configurer {

    config: IConfig;

    configPath: string;

    constructor() {
        this.config = config;
        this.configPath = join(__dirname, '../../config/config.json');
        console.log(this.configPath);
    }

    public writeCredentials(answers: Answers): ICredentials {
        const credentials = {
            url: resolve(answers.url, '/ocpi/emsp/versions/'),
            token: v4(),
            party_id: answers.party_id,
            country_code: answers.country_code,
            business_details: {
                name: answers.name
            }
        };
        this.config.msp.credentials = credentials;
        return this.config.msp.credentials;
    }

    public save(): void {
        const data = JSON.stringify(this.config, null, 2);
        writeFileSync(this.configPath, data);
    }

}