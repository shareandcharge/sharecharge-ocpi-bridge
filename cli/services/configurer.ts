import { writeFileSync } from 'fs';
import { join } from 'path';
import { resolve } from 'url';
import Helpers from '../../src/helpers/helpers';
import { Answers } from 'inquirer';
import Config from '../../src/models/config';
import ICredentials from '../../src/ocpi/2.1.1/interfaces/iCredentials';

const config: Config = require('../../config/config.json');

export default class Configurer {

    config: Config;

    configPath: string;

    constructor() {
        this.config = config;
        this.configPath = join(__dirname, '../../config/config.json');
    }

    public writeCredentials(answers: Answers): ICredentials {
        const credentials = {
            url: resolve(answers.url, '/ocpi/emsp/versions/'),
            token: Helpers.generateUUID(),
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
            modules: '',
            endpoints: []
        };
        this.config.cpo = cpo;
        return cpo;
    }

    public save(): void {
        const data = JSON.stringify(this.config, null, 2);
        writeFileSync(this.configPath, data);
    }

}