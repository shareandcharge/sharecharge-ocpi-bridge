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
    let simulator: Simulator;

    beforeEach(() => {
        bridge = new Bridge(config);
        simulator = new Simulator(config);
    });

    afterEach(() => bridge.ocpi.stopServer());

    it('should get name of bridge', () => {
        expect(bridge.name).to.equal('OCPI');
    });

    it('should get health of bridge', async () => {
        expect(await bridge.health()).to.equal(true);
    });

    context('#start', () => {
        const startParams: ISession = {
            scId: '0x01',
            evseId: 'de-123',
            controller: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
            tariffId: '0',
            tariffValue: '20',
            sessionId: '123'
        }
        const token = config.get(`msp.tokens.${startParams.controller}`);
        it('should return session id if start ACCEPTED', async () => {
            simulator.commands.startSuccess('LOC1', token, '55', 'ACCEPTED', 'ACCEPTED', true);
            const result = await bridge.start(startParams, '55');
            expect(result.success).to.equal(true);
            expect(result.data.sessionId).to.equal('55');
        });
        it('should return false if start request not ACCEPTED', async () => {
            simulator.commands.startSuccess('LOC1', token, '55', 'REJECTED', '', true);
            const result = await bridge.start(startParams, '55');
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Request not accepted');
        });
        it('should return false if start confirmation not ACCEPTED', async () => {
            simulator.commands.startSuccess('LOC1', token, '55', 'ACCEPTED', 'REJECTED', true);
            const result = await bridge.start(startParams, '55');
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Session start not accepted on charge point');
        });
    });

    context('#stop', () => {
        const session: IStopParameters = {
                scId: '0x01',
                evseId: 'evse-1',
                controller: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
                sessionId: '123'
        }
        it('should return true if stop ACCEPTED', async () => {
            simulator.commands.stopSuccess('123', 'ACCEPTED', 'ACCEPTED', true);
            const result = await bridge.stop(session);
            expect(result.success).to.equal(true);
        });
        it('should return false if stop request not ACCEPTED', async () => {
            simulator.commands.stopSuccess('123', 'REJECTED', '', true);
            const result = await bridge.stop(session);
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Request not accepted');
        });
        it('should return false if stop confirmation not ACCEPTED', async () => {
            simulator.commands.stopSuccess('123', 'ACCEPTED', 'REJECTED', true);
            const result = await bridge.stop(session);
            expect(result.success).to.equal(false);
            expect(result.data.message).to.equal('Session stop not accepted on charge point');
        });
    });

    context('#autoStop$', () => {
        it('should notify core client of session auto stop', async () => {
            setTimeout(async () => await request({
                method: 'PUT',
                uri: 'http://localhost:3001/ocpi/emsp/2.1.1/sessions/de/sc/123',
                headers: {
                    Authorization: 'Token ' + config.get('msp.credentials.token')
                },
                body: require('./config/session.json'),
                json: true
            }), 300);
            return new Promise((resolve, reject) => {
                bridge.autoStop$.subscribe(autoStop => {
                    console.log('autostop', autoStop);
                    expect(autoStop.data.sessionId).to.equal('123');
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