import { Subject } from 'rxjs';
import * as ConfigStore from 'configstore';
import { IBridge, IResult, ICDR, ISession, IStopParameters } from '@motionwerk/sharecharge-common/dist/common';
import { OCPI, push } from './services/ocpi';
import OcpiCDR from './ocpi/2.1.1/interfaces/iCDR';
import OcpiSession from './ocpi/2.1.1/interfaces/iSession';
import Helpers from './helpers/helpers';

export default class Bridge implements IBridge {

    public ocpi: OCPI;

    private autoStop = new Subject<IResult>();
    public autoStop$ = this.autoStop.asObservable();

    private cdr = new Subject<ICDR>();
    public cdr$ = this.cdr.asObservable();

    constructor(public config: ConfigStore = new ConfigStore('ocpi')) {
        this.ocpi = OCPI.getInstance(config);
        this.ocpi.startServer();
        push.on('session', (session: OcpiSession) => {
            if (session.status === 'COMPLETE') {
                const scId = Helpers.reverseLocationLookup(config, session.location.id);
                this.autoStop.next({
                    success: true,
                    data: {
                        session: {
                            scId,
                            evseId: '',
                            controller: '',
                            tariffId: '0',
                            tariffValue: '0'
                        },
                        sessionId: session.id
                    }
                })
            }
        });
        push.on('cdr', (cdr: OcpiCDR) => {
            const scId = Helpers.reverseLocationLookup(config, cdr.location.id);
            this.cdr.next({
                scId,
                evseId: '',                                                                          // needs to be linked to original start parameters
                price: cdr.total_cost * 100,
                chargedUnits: (cdr.total_energy * 1000) || (Math.round(cdr.total_time / 60 / 60))    // needs to be based on tariff
            });
        });
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
                const requested = await this.ocpi.commands.startSession(locationId, parameters.controller, requestId);
                if (requested.result !== 'ACCEPTED') {
                    throw Error('Request not accepted');
                }
                push.on('start', data => {
                    if (data.id === requestId) {
                        if (data.success === true) {
                            resolve({
                                success: true,
                                data: {
                                    sessionId: requestId
                                }
                            });
                        } else {
                            resolve({
                                success: false,
                                data: {
                                    message: 'Session start not accepted on charge point'
                                }
                            });
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
                const requested = await this.ocpi.commands.stopSession(parameters.sessionId);
                if (requested.result !== 'ACCEPTED') {
                    throw Error('Request not accepted');
                }
                push.on('stop', data => {
                    if (data.id === parameters.sessionId) {
                        if (data.success === true) {
                            resolve({
                                success: true,
                                data: {}
                            });
                        } else {
                            resolve({
                                success: false,
                                data: {
                                    message: 'Session stop not accepted on charge point'
                                }
                            });
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
