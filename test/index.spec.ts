import 'mocha';
import { expect } from 'chai';
import * as ConfigStore from 'configstore';
import Bridge from '../src';
import { ISession } from '@motionwerk/sharecharge-common/dist/common';
import { Simulator } from './simulation/cpo-responses/simulator';

const config = new ConfigStore('ocpi-test');
config.all = require('./config/config.json');

describe('Bridge Interface', () => {

    let bridge: Bridge;
    let session: ISession;
    let simulator: Simulator;

    before(() => {
        bridge = new Bridge(config);
        simulator = new Simulator(config);
        session = {
            scId: '0x01',
            evseId: 'de-123',
            tariffId: '0',
            tariffValue: '20'
        }
    });

    after(() => bridge.ocpi.stopServer());

    it('should get name of bridge', () => {
        expect(bridge.name).to.equal('OCPI');
    });

    it('should get health of bridge', async () => {
        expect(await bridge.health()).to.equal(true);
    });

    context('start', () => {
        it('should return session id on successful start', async () => {
            simulator.commands.startSuccess('LOC1', '55', true);
            const result = await bridge.start(session, '55');
            expect(result.success).to.equal(true);
            expect(result.data.sessionId).to.equal('55');
        });
    });

    context('stop', () => {
        it('should return true on successful stop', async () => {
            simulator.commands.stopSuccess('LOC1', '44', true);
            const result = await bridge.stop({
                scId: session.scId,
                evseId: session.evseId,
                sessionId: '44'
            });
            expect(result.success).to.equal(true);
        });
    });

});