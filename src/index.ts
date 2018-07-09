import { Subject } from 'rxjs';
import { IBridge, IResult, ICDR, ISession, IStopParameters } from '@motionwerk/sharecharge-common';
import { Modules } from './modules/modules';

export default class Bridge implements IBridge {

    private modules: Modules;

    private autoStop = new Subject<IResult>();
    public autoStop$ = this.autoStop.asObservable();

    private cdr = new Subject<ICDR>();
    public cdr$ = this.cdr.asObservable();

    constructor() {
        this.modules = Modules.getInstance();
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
