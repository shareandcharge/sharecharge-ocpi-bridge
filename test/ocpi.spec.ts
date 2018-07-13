import 'mocha';
import { expect } from 'chai';
import * as request from 'request-promise-native';
import * as ConfigStore from 'configstore';
import { OCPI } from '../src/services/ocpi';
import { Simulator } from './simulation/cpo-responses/simulator';

const config = new ConfigStore('ocpi-test', require('./config/config.json'));

describe('OCPI', () => {

    let ocpi: OCPI;
    let simulator: Simulator;

    beforeEach(() => {
        ocpi = OCPI.getInstance(config);
        ocpi.startServer();
        simulator = new Simulator(config);
    });

    afterEach(() => {
        ocpi.stopServer();
    });

    context('#versions', () => {
        // CLIENT
        context('CPO', () => {
            it('should return array of mutual versions from CPO side', async () => {
                simulator.versions.success();
                const result = await ocpi.versions.get();
                expect(result.length).to.equal(2);
                expect(result[0].url).to.equal('https://example.com/ocpi/cpo/2.1.1/');
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
        // SERVER
        context('eMSP', () => {
            it('should return array of versions available on eMSP side', async () => {
                const result = await request({
                    method: 'GET',
                    uri: 'http://127.0.0.1:3001/ocpi/emsp/versions',
                    headers: {
                        Authorization: `Token ${config.get('msp.credentials.token')}`
                    },
                    json: true
                });
                expect(result.data.length).to.equal(config.get('msp.versions').length);
                expect(result.data[0].version).to.equal(config.get('msp.versions')[0].version);
            });
            it('should return 401 if Authorization header incorrect', async () => {
                try {
                    await request({
                        method: 'GET',
                        uri: 'http://127.0.0.1:3001/ocpi/emsp/versions',
                        headers: {
                            Authorization: 'Token 123-456'
                        }
                    });
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('401 - "Unauthorized"');
                }
            });
        });
    });

    context('#modules', () => {
        // CLIENT
        context('CPO', () => {
            it('should return CPO modules for given version', async () => {
                simulator.modules.success();
                const result = await ocpi.modules.get();
                expect(result.version).to.equal('2.1.1');
                expect(result.endpoints[0].url).to.equal('https://example.com/ocpi/cpo/2.1.1/credentials');
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
        context('eMSP', () => {
            it('should return eMSP modules for given version', async () => {
                const result = await request({
                    method: 'GET',
                    uri: 'http://localhost:3001/ocpi/emsp/2.1.1/',
                    headers: {
                        Authorization: `Token ${config.get('msp.credentials.token')}`
                    },
                    json: true
                });
                expect(result.data.version).to.equal(config.get('msp.modules.version'));
                expect(result.data.endpoints.length).to.equal(config.get('msp.modules.endpoints').length);
                expect(result.data.endpoints[0].url).to.equal(config.get('msp.modules.endpoints')[0].url);
            });
            it('should return 401 if not authorized', async () => {
                try {
                    await request({
                        method: 'GET',
                        uri: 'http://localhost:3001/ocpi/emsp/2.1.1/',
                        headers: {
                            Authorization: 'Token 123'
                        }
                    });
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('401 - "Unauthorized"');
                }
            });
        });
    });

    context('#credentials', async () => {
        // CLIENT
        context('CPO', () => {
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
        // SERVER
        context('eMSP', () => {
            it('should return TOKEN_B on GET eMSP credentials', async () => {
                const result = await request({
                    method: 'GET',
                    uri: 'http://localhost:3001/ocpi/emsp/2.1.1/credentials',
                    headers: {
                        Authorization: `Token ${config.get('msp.credentials.token')}`
                    },
                    json: true
                });
                expect(result.data.token).to.equal(config.get('msp.credentials.token'));
            });
            it('should return 401 if not authorized', async () => {
                try {
                    await request({
                        method: 'GET',
                        uri: 'http://localhost:3001/ocpi/emsp/2.1.1/credentials',
                        headers: {
                            Authorization: 'Token 123'
                        }
                    });
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('401 - "Unauthorized"');
                }
            });
        });
    });

});