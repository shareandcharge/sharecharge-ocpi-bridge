import { Subject } from 'rxjs';
import * as ConfigStore from 'configstore';
import { IBridge, IResult, ICDR, ISession, IStopParameters } from '@motionwerk/sharecharge-common/dist/common';
import { OCPI } from './services/ocpi';

export default class Bridge implements IBridge {

    public ocpi: OCPI;

    private autoStop = new Subject<IResult>();
    public autoStop$ = this.autoStop.asObservable();

    private cdr = new Subject<ICDR>();
    public cdr$ = this.cdr.asObservable();

    constructor(public config: ConfigStore = new ConfigStore('ocpi')) {
        this.ocpi = OCPI.getInstance(config);
        this.ocpi.startServer();
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

    public start(parameters: ISession, id?: string): Promise<IResult> {
        return new Promise(async (resolve, reject) => {
            try {
                const locationId = this.config.get(`locations.${parameters.scId}`);
                const requestId = id || Math.round(Math.random() * 100000).toString();
                const requested = await this.ocpi.commands.startSession(locationId, requestId);
                if (requested.result !== 'ACCEPTED') {
                    throw Error('Request not accepted');
                }
                this.ocpi.commands.started$.subscribe(started => {  
                    if (started.id === requestId) {
                        if (started.success === true) {
                            resolve({
                                success: true,
                                data: {
                                    sessionId: requestId
                                }
                            });
                        } else {
                            throw Error('Session start not accepted on charge point');
                        }
                    }
                });
            } catch (err) {
                resolve({
                    success: false,
                    data: {
                        message: err.message
                    }
                });
            }
        });
    }

    public stop(parameters: IStopParameters): Promise<IResult> {
        return new Promise(async (resolve, reject) => {
            try {
                const locationId = this.config.get(`locations.${parameters.scId}`);
                const requestId = parameters.sessionId;
                const requested = await this.ocpi.commands.stopSession(locationId, requestId);
                if (requested.result !== 'ACCEPTED') {
                    throw Error('Request not accepted');
                }
                this.ocpi.commands.stopped$.subscribe(stopped => {
                    if (stopped.id === requestId) {
                        if (stopped.success === true) {
                            resolve({
                                success: true,
                                data: {}
                            });
                        } else {
                            throw Error('Session stop not accepted on charge point');
                        }
                    }
                });
            } catch (err) {
                resolve({
                    success: false,
                    data: {
                        message: err.message
                    }
                });
            }
        });
    }

}
