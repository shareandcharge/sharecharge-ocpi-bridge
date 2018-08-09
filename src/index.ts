import { Subject } from 'rxjs';
import * as ConfigStore from 'configstore';
import { IBridge, IResult, ICDR, ISession, IStopParameters, getConfigDir } from '@motionwerk/sharecharge-common/dist/common';
import { OCPI, push } from './services/ocpi';
import OcpiCDR from './ocpi/2.1.1/interfaces/iCDR';
import OcpiSession from './ocpi/2.1.1/interfaces/iSession';
import Helpers from './helpers/helpers';
import IToken from './ocpi/2.1.1/interfaces/iToken';
import SessionManager from './services/session.manager';

export default class Bridge implements IBridge {

    public ocpi: OCPI;

    private autoStop = new Subject<IResult>();
    public autoStop$ = this.autoStop.asObservable();

    constructor(public config: ConfigStore = new ConfigStore('ocpi')) {
        this.ocpi = OCPI.getInstance(config);
        this.ocpi.startServer();
        push.on('session', async (ocpiSession: OcpiSession) => {
            console.log('Received async session:', ocpiSession.id);
            if (ocpiSession.status !== 'COMPLETED') {
                // write the id once we get it so that the session can be stopped
                const scSession = Helpers.readSession(ocpiSession.auth_id);
                if (!scSession.sessionId) {
                    console.log('Saving session id:', ocpiSession.id);
                    scSession.sessionId = ocpiSession.id;
                    Helpers.writeSession(ocpiSession.auth_id, scSession);
                }
                const completed = SessionManager.isComplete(scSession, ocpiSession);
                if (completed) {
                    await this.ocpi.commands.stopSession(ocpiSession.id);
                }
            }
        });
        push.on('cdr', (cdr: OcpiCDR) => {
            // push to core client
            console.log('Recieved async cdr:', cdr.id);
            const scId = Helpers.reverseLocationLookup(config, cdr.location.id);
            const scSession = Helpers.readSession(cdr.auth_id);
            this.autoStop.next({
                success: true,
                data: {
                    sessionId: scSession.sessionId,
                    session: scSession,
                    cdr: {
                        scId,
                        evseId: scSession.evseId,
                        price: cdr.total_cost * 100,
                        chargedUnits: cdr.total_energy * 1000
                    }
                }
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
                const evseId = parameters.evseId;
                const requestId = id || Math.round(Math.random() * 100000).toString();
                const controller = parameters.controller;
                let token: IToken = this.config.get(`msp.tokens.${controller}`);
                if (!token) {
                    token = Helpers.generateToken(this.config, controller);
                    await this.ocpi.tokens.put(token);
                    console.log(`New token created for ${controller}: ${token.uid}`);
                }
                const requested = await this.ocpi.commands.startSession(locationId, evseId, token, requestId);
                if (requested !== 'ACCEPTED') {
                    throw Error('Request not accepted');
                }
                push.on('start', data => {
                    if (data.id === requestId) {
                        if (data.success === true) {
                            Helpers.writeSession(token.auth_id, parameters);
                            // poll for status updates 
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
                const auth_id = this.config.get(`msp.tokens.${parameters.controller}`).auth_id;
                const scSession = Helpers.readSession(auth_id);
                const requested = await this.ocpi.commands.stopSession(scSession.sessionId);
                if (requested !== 'ACCEPTED') {
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
