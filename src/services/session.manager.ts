import { ISession as scSession } from '@motionwerk/sharecharge-common';
import ocpiSession from '../ocpi/2.1.1/interfaces/iSession';
import { OCPI } from './ocpi';

export default class SessionManager {

    static energyScheduler(sc: scSession, ocpi: ocpiSession): boolean {
        const max = parseInt(sc.tariffValue);
        const current = ocpi.kwh * 1000;
        return current >= max;
    }

    static timeScheduler(sc: scSession, ocpi: ocpiSession): boolean {
        const max = parseInt(sc.tariffValue);
        const start = new Date(ocpi.start_datetime).getTime() / 1000;   // convert to seconds
        const now = Date.now() / 1000;
        const current = Math.round(now - start);
        return current >= max;
    }

    static isComplete(sc: scSession, ocpi: ocpiSession): boolean {
        if (sc.tariffId === '0') {
            return SessionManager.energyScheduler(sc, ocpi);
        } else {
            return SessionManager.timeScheduler(sc, ocpi);
        }
    }

}