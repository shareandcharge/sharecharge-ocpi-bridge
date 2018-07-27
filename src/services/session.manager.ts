import { ISession as scSession } from '@motionwerk/sharecharge-common';
import ocpiSession from '../ocpi/2.1.1/interfaces/iSession';
import { OCPI } from './ocpi';

export default class SessionManager {

    id: string;

    poller: NodeJS.Timer;
    interval: number;

    constructor(private sc: scSession, private ocpi: OCPI) {
        this.id = this.sc.sessionId;
    }

    private async getSession(): Promise<ocpiSession> {
        const sessions = await this.ocpi.sessions.get();
        return sessions.filter(session => session.id === this.id)[0];
    }

    private energyScheduler() {
        this.poller = setInterval(async () => {
            const max = parseInt(this.sc.tariffValue) / 1000;
            const session = await this.getSession();
            if (session && (session.kwh >= max)) {
                this.ocpi.commands.stopSession(this.id);
                this.stop();
            }
        }, this.interval);
    }

    private timeScheduler() {
        this.poller = setInterval(async () => {
            const max = parseInt(this.sc.tariffValue);
            const session = await this.getSession();
            if (session && session.start_datetime) {
                const start = new Date(session.start_datetime).getTime() / 1000;
                const now = Date.now() / 1000;
                if ((now - start) >= max) {
                    this.ocpi.commands.stopSession(this.id);
                    this.stop();
                } 
            }
        }, this.interval);
    }

    public start(interval: number) {
        this.interval = interval * 1000;
        if (this.sc.tariffId === '0') {
            this.energyScheduler();
        } else {
            this.timeScheduler();
        }
    }

    public stop() {
        clearInterval(this.poller);
    }

}