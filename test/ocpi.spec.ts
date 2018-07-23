import 'mocha';
import { expect } from 'chai';
import * as request from 'request-promise-native';
import * as ConfigStore from 'configstore';
import { OCPI } from '../src/services/ocpi';
import { Simulator } from './simulation/cpo-responses/simulator';
import IToken from '../src/ocpi/2.1.1/interfaces/iToken';
import { token } from './config/token';

const config = new ConfigStore('ocpi-test');
config.all = require('./config/config.json');
config.set('msp.token', token);

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
        context('CPO endpoints (pull)', () => {
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
        context('eMSP endpoints (push)', () => {
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
            it('should return 2000 if Authorization header incorrect', async () => {
                const result = await request({
                    method: 'GET',
                    uri: 'http://127.0.0.1:3001/ocpi/emsp/versions',
                    headers: {
                        Authorization: 'Token 123-456'
                    },
                    json: true
                });
                expect(result.status_code).to.equal(2000);
            });
        });
    });

    context('#modules', () => {
        // CLIENT
        context('CPO endpoints (pull)', () => {
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
        context('eMSP endpoints (push)', () => {
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
            it('should return 2000 if not authorized', async () => {
                const result = await request({
                    method: 'GET',
                    uri: 'http://localhost:3001/ocpi/emsp/2.1.1/',
                    headers: {
                        Authorization: 'Token 123'
                    },
                    json: true
                });
                expect(result.status_code).to.equal(2000);
            });
        });
    });

    context('#credentials', async () => {
        // CLIENT
        context('CP0O endpoints (pull)', () => {
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
        context('eMSP endpoints (push)', () => {
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
            it('should return 2000 if not authorized', async () => {
                const result = await request({
                    method: 'GET',
                    uri: 'http://localhost:3001/ocpi/emsp/2.1.1/credentials',
                    headers: {
                        Authorization: 'Token 123'
                    },
                    json: true
                });
                expect(result.status_code).to.equal(2000);
            });
        });
    });

    context('#tariffs', () => {
        context('CPO endpoints (pull)', () => {
            it('should get non-paginated tariffs', async () => {
                simulator.tariffs.success();
                const result = await ocpi.tariffs.get();
                expect(result[0].id).to.equal('12');
                expect(result[0].elements.length).to.equal(1);
            });
            it('should throw if OCPI status code not 1000', async () => {
                simulator.tariffs.ocpiError();
                try {
                    await ocpi.tariffs.get();
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET tariffs: 2000 - Generic client error');
                }
            });
            it('should throw if HTTP status code not 2xx', async () => {
                simulator.tariffs.httpError();
                try {
                    await ocpi.tariffs.get();
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET tariffs: 500 - "Internal server error"');
                }
            });
        });
    });

    context('#locations', () => {
        context('CPO endpoints (pull)', () => {
            const locationId = 'LOC1';
            it('should return location object of given location ID', async () => {
                simulator.locations.success(locationId);
                const result = await ocpi.locations.get(locationId);
                expect(result.id).to.equal('LOC1');
            });
            it('should throw if OCPI response status not 1000', async () => {
                simulator.locations.ocpiError(locationId);
                try {
                    await ocpi.locations.get(locationId);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET locations: 2000 - Generic client error');
                }
            });
            it('should throw if HTTP response not 2xx', async () => {
                simulator.locations.httpError(locationId);
                try {
                    await ocpi.locations.get(locationId);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET locations: 500 - "Internal server error"');
                }
            });
        });
    });

    context('#tokens', () => {
        const uid = '012345678';
        context('CPO endpoints (push)', () => {
            it('should get token cached by CPO by its UID', async () => {
                simulator.tokens.getSuccess(uid);
                const result = await ocpi.tokens.get(uid);
                expect(result.uid).to.equal('012345678');
            });
            it('should throw if OCPI response not 1000', async () => {
                simulator.tokens.getOcpiError(uid);
                try {
                    await ocpi.tokens.get(uid);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET tokens: 2000 - Generic client error');
                }
            });
            it('should throw if HTTP response not 2xx', async () => {
                simulator.tokens.getHttpError(uid);
                try {
                    await ocpi.tokens.get(uid);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET tokens: 400 - "Bad request"');
                }
            });
            it('should return 1000 if updated token cache successfully', async () => {
                simulator.tokens.putSuccess(token);
                const result = await ocpi.tokens.put(token);
                expect(result).to.equal(undefined);
            });
            it('should throw if OCPI response not 1000', async () => {
                simulator.tokens.putOcpiError(token);
                try {
                    await ocpi.tokens.put(token);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('PUT tokens: 2000 - Generic client error');
                }
            });
            it('should throw if HTTP response not 2xx', async () => {
                simulator.tokens.putHttpError(token);
                try {
                    await ocpi.tokens.put(token);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('PUT tokens: 500 - "Internal server error"');
                }
            });
        });
    });

    context('#sessions', () => {
        context.skip('CPO endpoints (pull)', () => {
            it('should return location object of given location ID', async () => {
                simulator.sessions.success();
                const result = await ocpi.sessions.get();
                expect(result[0].id).to.equal('LOC1');
            });
            it('should throw if OCPI response status not 1000', async () => {
                simulator.sessions.ocpiError();
                try {
                    await ocpi.sessions.get();
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET locations: 2000 - Generic client error');
                }
            });
            it('should throw if HTTP response not 2xx', async () => {
                simulator.sessions.httpError();
                try {
                    await ocpi.sessions.get();
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET locations: 500 - "Internal server error"');
                }
            });
        });
        context('eMSP endpoints (push)', () => {
            it('should respond with 3000 if session does not exist', async () => {
                const result = await request({
                    method: 'GET',
                    uri: 'http://localhost:3001/ocpi/emsp/2.1.1/sessions/de/sc/125',
                    headers: {
                        Authorization: 'Token ' + config.get('msp.credentials.token')
                    },
                    json: true
                });
                expect(result.status_code).to.equal(3000);
            });
        });
    });

    context('#commands', () => {
        const location = 'LOC1';
        const id = '123';
        context('CPO endpoints', () => {
            it('should send request to remotely start a session', async () => {
                simulator.commands.startSuccess(location, id, 'ACCEPTED', '');
                const result = await ocpi.commands.startSession(location, id);
                expect(result.result).to.equal('ACCEPTED');
            });
            it('should throw if ocpi response not 1000', async () => {
                simulator.commands.startOcpiError(location, id);
                try {
                    await ocpi.commands.startSession(location, id);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('POST commands/START_SESSION: 2000 - Generic client error');
                }
            });
            it('should throw if http response not 2xx', async () => {
                simulator.commands.startHttpError(location, id);
                try {
                    await ocpi.commands.startSession(location, id);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('POST commands/START_SESSION: 400 - "Bad request"');
                }
            });
            it('should send request to remotely stop a session', async () => {
                simulator.commands.stopSuccess(id, 'ACCEPTED', '');
                const result = await ocpi.commands.stopSession(id);
                expect(result.result).to.equal('ACCEPTED');
            });
            it('should throw if ocpi response not 1000', async () => {
                simulator.commands.stopOcpiError(id);
                try {
                    await ocpi.commands.stopSession(id);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('POST commands/STOP_SESSION: 2000 - Generic client error');
                }
            });
            it('should throw if http response not 2xx', async () => {
                simulator.commands.stopHttpError(id);
                try {
                    await ocpi.commands.stopSession(id);
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('POST commands/STOP_SESSION: 500 - "Internal server error"');
                }
            });
        });
        context('eMSP endpoints', () => {
            it('should respond with 1000 on async confirm start', async () => {
                const result = await request({
                    method: 'POST',
                    uri: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/START_SESSION/1',
                    headers: {
                        Authorization: 'Token ' + config.get('msp.credentials.token')
                    },
                    body: {
                        result: 'REJECTED'
                    },
                    json: true
                });
                expect(result.status_code).to.equal(1000);
            });
            it('should respond with 1000 on async confirm stop', async () => {
                const result = await request({
                    method: 'POST',
                    uri: 'http://localhost:3001/ocpi/emsp/2.1.1/commands/STOP_SESSION/1',
                    headers: {
                        Authorization: 'Token ' + config.get('msp.credentials.token')
                    },
                    body: {
                        result: 'ACCEPTED'
                    },
                    json: true
                });
                expect(result.status_code).to.equal(1000);
            });
        });
    });

    context('#CDRs', () => {
        context('CPO endpoints', () => {
            it('should return charge detail record', async () => {
                simulator.cdrs.success();
                const result = await ocpi.cdrs.get();
                expect(result[0].total_cost).to.equal(4.00);
            });
            it('should throw if OCPI response not 1000', async () => {
                simulator.cdrs.ocpiError();
                try {
                    await ocpi.cdrs.get();
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET cdrs: 2000 - Generic client error');
                }
            });
            it('should throw if HTTP response not 2xx', async () => {
                simulator.cdrs.httpError();
                try {
                    await ocpi.cdrs.get();
                    expect.fail();
                } catch (err) {
                    expect(err.message).to.equal('GET cdrs: 500 - "Internal server error"');
                }
            });
        });
        context('eMSP endpoints', () => {
            it('should return 1000 on successful CDR push', async () => {
                // const result = await request({

                // });
            });
        });
    });
});