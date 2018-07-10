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
        this.writeEndpoints(answers.url); 
        return this.config.msp.credentials;
    }

    public writeEndpoints(url: string): void {
        this.config.msp.versions.map(version => {
            version.url = join(url, `/ocpi/emsp/${version.version}/`)
        });
        this.config.msp.modules.endpoints.map(endpoint => {
            endpoint.url = join(url, `/ocpi/emsp/${config.version}/${endpoint.identifier}`);
        });
    }


    public writeCPO(answers: Answers): { versions: string, headers: { Authorization: string } } {
        const cpo = {
            versions: answers.url,
            headers: {
                Authorization: `Token ${answers.token}`
            },
            modules: ''
        };
        this.config.cpo = cpo;
        return cpo;
    }

    public save(): void {
        const data = JSON.stringify(this.config, null, 2);
        writeFileSync(this.configPath, data);
    }

}