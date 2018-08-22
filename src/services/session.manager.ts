import { ISession as scSession } from '@motionwerk/sharecharge-common';
import ocpiSession from '../ocpi/2.1.1/interfaces/iSession';

export default class SessionManager {

    static energyScheduler(sc: scSession, ocpi: ocpiSession): boolean {
        const max = parseInt(sc.tariffValue);
        const current = ocpi.kwh * 1000;
        console.log(`${ocpi.id} consumption: ${current}/${max} watt hours`);
        return current >= max;
    }

    static timeScheduler(sc: scSession, ocpi: ocpiSession): boolean {
        const max = parseInt(sc.tariffValue);
        const start = new Date(ocpi.start_datetime).getTime() / 1000;   // convert to seconds
        const now = Date.now() / 1000;
        const current = Math.round(now - start);
        console.log(`${ocpi.id} duration: ${current}/${max} seconds`);
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