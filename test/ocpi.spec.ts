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

    context('versions', () => {
        it('should return url of mutual version', async () => {
            simulator.versions.success();
            const result = await ocpi.versions.pull();
            expect(result).to.equal('https://example.com/ocpi/cpo/2.1.1/');
        });
    });

});