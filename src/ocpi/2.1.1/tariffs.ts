import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import { ITariff } from '@motionwerk/sharecharge-common/dist/common';
import Helpers from '../../helpers/helpers';
import send from '../../services/send';

export class Tariffs {

    router: Router;

    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    public async get(): Promise<ITariff[]> {
        try {
            const result = await send({
                method: 'GET', 
                uri: Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'tariffs'),
                headers: this.config.get('cpo.headers'),
            });
            return result;
        } catch (err) {
            throw Error('GET tariffs: ' + err.message);
        }
    }

}