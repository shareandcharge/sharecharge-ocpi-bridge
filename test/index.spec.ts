import 'mocha';
import { expect } from 'chai';
import * as ConfigStore from 'configstore';
import Bridge from '../src';
import { ISession, IStopParameters } from '@motionwerk/sharecharge-common/dist/common';
import { Simulator } from './simulation/cpo-responses/simulator';
import * as request from 'request-promise-native';

const config = new ConfigStore('ocpi-test');
config.all = require('./config/config.json');

describe('Bridge Interface', () => {

    let bridge: Bridge;
    let session: ISession;
    let simulator: Simulator;

    beforeEach(() => {
        bridge = new Bridge(config);
        simulator = new Simulator(config);
        session = {
            scId: '0x01',
            evseId: 'de-123',
            tariffId: '0',
            tariffValue: '20'
        }
    });

    afterEach(() => bridge.ocpi.stopServer());

    it('should get name of bridge', () => {
        expect(bridge.name).to.equal('OCPI');
    });

    it('should get health of bridge', async () => {
        expect(await bridge.health()).to.equal(true);
    });

    context('#start', () => {
        it('should return session id if start ACCEPTED', async () => {
            simulator.commands.startSuccess('LOC1', '55', 'ACCEPTED', 'ACCEPTED', true);
            const result = await bridge.start(session, '55');
            expect(result.success).to.equal(true);
            expect(result.data.sessionId).to.equal('55');
        });
        it('should return false if start request not ACCEPTED', async () => {
            simulator.commands.startSuccess('LOC1', '55', 'REJECTED', '', true);
            const result = await bridge.start(session, '55');
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Request not accepted');
        });
        it('should return false if start confirmation not ACCEPTED', async () => {
            simulator.commands.startSuccess('LOC1', '55', 'ACCEPTED', 'REJECTED', true);
            const result = await bridge.start(session, '55');
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Session start not accepted on charge point');
        });
    });

    context('#stop', () => {
        const session: IStopParameters = {
                scId: '0x01',
                evseId: 'evse-1',
                sessionId: '44'
        }
        it('should return true if stop ACCEPTED', async () => {
            simulator.commands.stopSuccess('44', 'ACCEPTED', 'ACCEPTED', true);
            const result = await bridge.stop(session);
            expect(result.success).to.equal(true);
        });
        it('should return false if stop request not ACCEPTED', async () => {
            simulator.commands.stopSuccess('44', 'REJECTED', '', true);
            const result = await bridge.stop(session);
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Request not accepted');
        });
        it('should return false if stop confirmation not ACCEPTED', async () => {
            simulator.commands.stopSuccess('44', 'ACCEPTED', 'REJECTED', true);
            const result = await bridge.stop(session);
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Session stop not accepted on charge point');
        });
    });

    context('#autoStop$', () => {
        it('should notify core client of session auto stop', async () => {
            setTimeout(async () => await request({
                method: 'PUT',
                uri: 'http://localhost:3001/ocpi/emsp/2.1.1/sessions/de/sc/101',
                headers: {
                    Authorization: 'Token ' + config.get('msp.credentials.token')
                },
                body: require('./config/session.json'),
                json: true
            }), 100);
            return new Promise((resolve, reject) => {
                bridge.autoStop$.subscribe(autoStop => {
                    expect(autoStop.data.sessionId).to.equal('101');
                    resolve();
                });
            });
        });
    });

    context('#cdr$', () => {
        it('should notify core client of async cdr receipt', async () => {
            setTimeout(async () => await request({
                method: 'POST',
                uri: 'http://localhost:3001/ocpi/emsp/2.1.1/cdrs',
                headers: {
                    Authorization: 'Token ' + config.get('msp.credentials.token')
                },
                body: require('./config/cdr.json'),
                json: true
            }), 100);
            return new Promise((resolve, reject) => {
                bridge.cdr$.subscribe(cdr => {
                    expect(cdr.price).to.equal(400);
                    expect(cdr.scId).to.equal('0x01')
                    resolve();
                });
            });
        });
    });


});