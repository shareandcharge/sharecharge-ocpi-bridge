import { Subject } from 'rxjs';
import * as ConfigStore from 'configstore';
import { IBridge, IResult, ICDR, ISession, IStopParameters } from '@motionwerk/sharecharge-common/dist/common';
import { OCPI } from './services/ocpi';

export default class Bridge implements IBridge {

    private ocpi: OCPI;

    private autoStop = new Subject<IResult>();
    public autoStop$ = this.autoStop.asObservable();

    private cdr = new Subject<ICDR>();
    public cdr$ = this.cdr.asObservable();

    constructor(public config: ConfigStore = new ConfigStore('ocpi')) {
        this.ocpi = OCPI.getInstance(config);
    }

    public get name(): string {
        return 'OCPI';
    }

    public loadTariffs(tariffs: any): void {
        return;
    }

    public async health(): Promise<boolean> {
        return true;
    }

    public async start(parameters: ISession): Promise<IResult> {
        try {
            const locationId = this.config.get(`locations.${parameters.scId}`);
            const requestId = Math.round(Math.random() * 100000).toString();
            const requested = await this.ocpi.commands.startSession(locationId, requestId);
            if (requested.result !== 'ACCEPTED') {
                throw Error('Request not accepted');
            }
            this.ocpi.commands.started$.subscribe(started => {
                if (started.id === requestId) {
                    if (started.success === true) {
                        return {
                            success: true,
                            data: {
                                sessionId: requestId
                            }
                        }
                    } else {
                        throw Error('Session start not accepted on charge point');
                    }
                }
            });
        } catch (err) {
            return {
                success: false,
                data: {
                    message: err.message
                }
            }
        }
    }

    public async stop(parameters: IStopParameters): Promise<IResult> {
        try {
            const locationId = this.config.get(`locations.${parameters.scId}`);
            const requestId = Math.round(Math.random() * 100000).toString();
            const requested = await this.ocpi.commands.stopSession(locationId, requestId);
            if (requested.result !== 'ACCEPTED') {
                throw Error('Request not accepted');
            }
            this.ocpi.commands.stopped$.subscribe(stopped => {
                if (stopped.id === requestId) {
                    if (stopped.success === true) {
                        return {
                            success: true,
                            data: {}
                        }
                    } else {
                        throw Error('Session stop not accepted on charge point');
                    }
                }
            });
        } catch (err) {
            return {
                success: false,
                data: {
                    message: err.message
                }
            }
        }
    }

}
