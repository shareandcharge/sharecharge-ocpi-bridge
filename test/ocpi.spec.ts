import 'mocha';
import { expect } from 'chai';
import * as request from 'request-promise-native';
import { OCPI } from '../src/services/ocpi';
import { Simulator } from './simulation/simulator';

describe('OCPI', () => {

    let ocpi: OCPI;
    let simulator: Simulator;

    beforeEach(() => {
        ocpi = OCPI.getInstance();
        ocpi.startServer();
        simulator = new Simulator();
    });

    afterEach(() => {
        ocpi.stopServer();
    });

    context('#versions', () => {
        // CLIENT
        it('should return array of mutual versions from CPO side', async () => {
            simulator.versions.success();
            const result = await ocpi.versions.get();
            expect(result.length).to.equal(2);
            expect(result[0].url).to.equal('https://example.com/ocpi/cpo/2.1.1/');
        });
        it('should parse CPO versions to find mutual url', async () => {
            simulator.versions.success();
            const result = await ocpi.versions.get();
            expect(ocpi.versions.findUrl(result)).to.equal('https://example.com/ocpi/cpo/2.1.1/');
        });
        it('should throw if OCPI status code is not 1000', async () => {
            simulator.versions.ocpiError();
            try {
                await ocpi.versions.get();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('GET versions: 2000 - Generic client error');
            }
        });
        it('should throw if HTTP response not 2xx', async () => {
            simulator.versions.httpError();
            try {
                await ocpi.versions.get();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('GET versions: 400 - "Bad Request"');
            }
        });
        // SERVER
        it.only('should return array of versions available on eMSP side', async () => {
            const result = await request({
                method: 'GET',
                uri: 'http://127.0.0.1:3001/ocpi/emsp/versions',
                json: true
            });
            expect(result.length).to.equal(1);
            expect(result[0].version).to.equal('2.1.1');
        });
    });

    context('#modules', () => {
        it('should return object of modules for given version', async () => {
            simulator.modules.success();
            const result = await ocpi.modules.get();
            const modules = ocpi.modules.createModuleObject(result);
            expect(Object.keys(modules).length).to.equal(2);
            expect(modules.credentials).to.equal('https://example.com/ocpi/cpo/2.0/credentials/');
        });
        it('should throw if OCPI response not 1000', async () => {
            simulator.modules.ocpiError();
            try {
                await ocpi.modules.get();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('GET modules: 2000 - Generic client error');
            }
        });
        it('should throw if HTTP response not 2xx', async () => {
            simulator.modules.httpError();
            try {
                await ocpi.modules.get();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('GET modules: 500 - "Internal server error"');
            }
        });
    });

    context('#credentials', async () => {
        it('should return TOKEN_C on GET /credentials ', async () => {
            simulator.credentials.getSuccess();
            const result = await ocpi.credentials.get();
            expect(result.token).to.equal('ebf3b399-779f-4497-9b9d-ac6ad3cc44d2');
        });
        it('should throw if GET OCPI response not 1000', async () => {
            simulator.credentials.getOcpiError();
            try {
                await ocpi.credentials.get();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('GET credentials: 2000 - Generic client error');
            }
        });
        it('should throw if GET HTTP response not 200', async () => {
            simulator.credentials.getHttpError();
            try {
                await ocpi.credentials.get();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('GET credentials: 400 - "Bad request"');
            }
        });
        it('should return TOKEN_C on POST /credentials (registration)', async () => {
            simulator.credentials.postSuccess();
            const result = await ocpi.credentials.post();
            expect(result.token).to.equal('e345383a-ba4c-4514-bc99-e0152ceea4c5')
        });
        it('should throw if POST OCPI response not 1000', async () => {
            simulator.credentials.postOcpiError();
            try {
                await ocpi.credentials.post();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('POST credentials: 2000 - Generic client error');
            }
        });
        it('should throw if POST HTTP response not 200', async () => {
            simulator.credentials.postHttpError();
            try {
                await ocpi.credentials.post();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('POST credentials: 500 - "Internal server error"');
            }
        });
    });

});