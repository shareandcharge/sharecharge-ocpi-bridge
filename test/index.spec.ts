import 'mocha';
import { expect } from 'chai';
import Bridge from '../src/index';

describe('Bridge Interface', () => {

    let bridge;

    beforeEach(() => {
        bridge = new Bridge();
    });

    it('should get name of bridge', () => {
        expect(bridge.name).to.equal('OCPI');
    });

});