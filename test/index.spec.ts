import 'mocha';
import { expect } from 'chai';
import * as ConfigStore from 'configstore';
import Bridge from '../src';
import { ISession } from '@motionwerk/sharecharge-common/dist/common';

const config = new ConfigStore('ocpi-test', require('./config/config.json'));

describe('Bridge Interface', () => {

    let bridge: Bridge;
    let session: ISession;

    beforeEach(() => {
        bridge = new Bridge(config);
        session = {
            scId: '0x01',
            evseId: 'de-123',
            tariffId: '0',
            tariffValue: '20'
        }
    });

    it('should get name of bridge', () => {
        expect(bridge.name).to.equal('OCPI');
    });

    it('should get health of bridge', async () => {
        expect(await bridge.health()).to.equal(true);
    });

    context('start', () => {
        it('should return session id on successful start', async () => {
            const result = await bridge.start(session);
            expect(result.success).to.equal(true);
        });
    });

    context('stop', () => {
        it('should return true on successful stop', async () => {
            const startRes = await bridge.start(session);
            const result = await bridge.stop({
                scId: session.scId,
                evseId: session.evseId,
                sessionId: startRes.data.sessionId
            });
            expect(result.success).to.equal(true);
        });
    });

});