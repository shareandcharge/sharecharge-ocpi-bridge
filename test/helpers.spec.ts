import 'mocha';
import { expect } from 'chai';
import * as ConfigStore from 'configstore';
import Helpers from '../src/helpers/helpers';
import Config from '../src/models/config';

const config: Config = require('./config/config.json');
const configStore = new ConfigStore('ocpi-test');
configStore.all = config;

describe('Helpers', () => {

    it('should parse modules for given endpoint', () => {
       const endpoint = Helpers.getEndpointByIdentifier(config.cpo.endpoints, 'credentials');
       expect(endpoint).to.equal('http://localhost:3000/ocpi/cpo/2.1.1/credentials'); 
    });

    it('should parse versions for correct version url', () => {
        const url = Helpers.getUrlByVersion(config.msp.versions, '2.1.1');
        expect(url).to.equal('http://localhost:3001/ocpi/emsp/2.1.1/');
    });

    it('should generate token with unique eMA ID', () => {
        const token = Helpers.generateToken(configStore, '0x123');
        expect(/\w{2}-[A-Za-z0-9]{3}-C[A-Z0-9]{8}/.test(token.auth_id)).to.equal(true);
    });

});