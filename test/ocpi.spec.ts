import 'mocha';
import { expect } from 'chai';
import { OCPI } from '../src/services/ocpi';
import { Simulator } from './simulation/simulator';

describe('OCPI', () => {

    let ocpi: OCPI;
    let simulator: Simulator;

    beforeEach(() => {
        ocpi = OCPI.getInstance()
        simulator = new Simulator();
    });

    context('#versions', () => {
        it('should return url of mutual version', async () => {
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
        it('should return token on GET /credentials ', async () => {
            simulator.credentials.getSuccess();
            const result = await ocpi.credentials.get();
            expect(result.token).to.equal('ebf3b399-779f-4497-9b9d-ac6ad3cc44d2');
        });
    });

});