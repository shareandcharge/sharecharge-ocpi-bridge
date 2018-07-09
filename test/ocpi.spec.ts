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
            const result = await ocpi.versions.pull();
            expect(result).to.equal('https://example.com/ocpi/cpo/2.1.1/');
        });
        it('should throw if mutual version does not exist', async () => {
            simulator.versions.noMutualVersion();
            try {
                await ocpi.versions.pull();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('PULL versions: Unable to find URL for 2.1.1');
            }
        });
        it('should throw if OCPI status code is not 1000', async () => {
            simulator.versions.ocpiError();
            try {
                await ocpi.versions.pull();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('PULL versions: 2000 - Generic client error');
            }
        });
        it('should throw if HTTP response not 2xx', async () => {
            simulator.versions.httpError();
            try {
                await ocpi.versions.pull();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('PULL versions: 400 - "Bad Request"');
            }
        });
    });

    context('#modules', () => {
        it('should return object of modules for given version', async () => {
            simulator.modules.success();
            const result = await ocpi.modules.pull();
            expect(Object.keys(result).length).to.equal(2);
            expect(result.credentials).to.equal('https://example.com/ocpi/cpo/2.0/credentials/');
        });
        it('should throw if OCPI response not 1000', async () => {
            simulator.modules.ocpiError();
            try {
                await ocpi.modules.pull();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('PULL modules: 2000 - Generic client error');
            }
        });
        it('should throw if HTTP response not 2xx', async () => {
            simulator.modules.httpError();
            try {
                await ocpi.modules.pull();
                expect.fail();
            } catch (err) {
                expect(err.message).to.equal('PULL modules: 500 - "Internal server error"');
            }
        });
    });

});