import { Router, Request, Response } from 'express';
import * as request from 'request-promise-native';
import * as ConfigStore from 'configstore';
import { ITariff } from '@motionwerk/sharecharge-common/dist/common';
import Helpers from '../../helpers/helpers';

export class Tariffs {

    router: Router;

    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    public async get(): Promise<ITariff[]> {
        try {
            const result = await request({
                method: 'GET', 
                uri: Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'tariffs'),
                headers: this.config.get('cpo.headers'),
                json: true
            });
            if (result.status_code === 1000) {
                return result.data;
            } else {
                throw Error(`${result.status_code} - ${result.status_message}`);
            }
        } catch (err) {
            throw Error('GET tariffs: ' + err.message);
        }
    }

}