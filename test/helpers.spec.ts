import 'mocha';
import { expect } from 'chai';
import Helpers from '../src/helpers/helpers';
import IConfig from '../src/interfaces/iConfig';

const config: IConfig = require('./config/config.json');

describe('Helpers', () => {

    it('should parse modules for given endpoint', () => {
       const endpoint = Helpers.getEndpointByIdentifier(config.cpo.endpoints, 'credentials');
       expect(endpoint).to.equal('http://localhost:3000/ocpi/cpo/2.1.1/credentials'); 
    });

    it('should parse versions for correct version url', () => {
        const url = Helpers.getUrlByVersion(config.msp.versions, '2.1.1');
        expect(url).to.equal('http:/localhost:3001/ocpi/emsp/2.1.1/');
    });

});