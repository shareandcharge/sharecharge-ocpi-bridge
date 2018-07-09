import { IBridge } from '@motionwerk/sharecharge-common';
import { Modules } from './modules/modules';

export default class Bridge /* implements IBridge */ {

    private modules: Modules;

    constructor() {
        this.modules = Modules.getInstance();
    }

    get name(): string {
        return 'OCPI';
    }

}
