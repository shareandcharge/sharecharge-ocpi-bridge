import 'mocha';
import { expect } from 'chai';
import Helpers from '../src/helpers/helpers';
import IConfig from '../src/interfaces/iConfig';

const config: IConfig = require('./config/config.json');

describe('Helpers', () => {

    it('should parse modules for given endpoint', () => {
       const endpoint = Helpers.getEndpoint(config.cpo.endpoints, 'credentials');
       expect(endpoint).to.equal('http://localhost:3000/ocpi/cpo/2.1.1/credentials'); 
    });

    it('should throw if unable to find endpoint', () => {
        try {
            Helpers.getEndpoint(config.cpo.endpoints, 'lcations');
            expect.fail();
        } catch (err) {
            expect(err.message).to.equal('No endpoint found for lcations module!');
        }
    });

});