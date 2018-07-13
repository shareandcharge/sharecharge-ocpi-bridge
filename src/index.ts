import { Subject } from 'rxjs';
import * as configStore from 'configstore';
import { IBridge, IResult, ICDR, ISession, IStopParameters } from '@motionwerk/sharecharge-common/dist/common';
import { OCPI } from './services/ocpi';
import Config from './models/config';

const prodConfig: Config = new configStore('ocpi').all;

export default class Bridge implements IBridge {

    private ocpi: OCPI;

    private autoStop = new Subject<IResult>();
    public autoStop$ = this.autoStop.asObservable();

    private cdr = new Subject<ICDR>();
    public cdr$ = this.cdr.asObservable();

    // express middleware seems to use single scope (whichever is initiated first)
    // therefore config needs to be the same across all tests
    constructor(config: Config = prodConfig) {
        this.ocpi = OCPI.getInstance(config);
    }

    public get name(): string {
        return 'OCPI';
    }

    public loadTariffs(tariffs: any): void {
        // OCPI defines a CDR modules which pushes session prices to us: 
        // we don't care about the tariffs in this bridge
        return;
    }

    public async health(): Promise<boolean> {
        return true;
    }

    public async start(parameters: ISession): Promise<IResult> {
        // call ocpi.commands.startSession(evseId);
        // subscribe to ocpi.commands.sessionStarted$
        return {
            success: true,
            data: {
                sessionId: '123'
            }
        }
    }

    public async stop(parameters: IStopParameters): Promise<IResult> {
        return {
            success: true,
            data: {}
        }
    }

}
