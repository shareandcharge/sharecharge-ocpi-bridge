import { Router, Request, Response } from 'express';
import * as ConfigStore from 'configstore';
import { ILocation } from '@motionwerk/sharecharge-common/dist/common';
import Helpers from '../../helpers/helpers';
import send from '../../services/send';

export class Locations {

    router: Router;

    constructor(private config: ConfigStore) {
        this.router = Router();
    }

    public async get(locationId: string): Promise<ILocation> {
        try {
            const result = await send({
                method: 'GET', 
                uri: Helpers.getEndpointByIdentifier(this.config.get('cpo.endpoints'), 'locations') + '/' + locationId,
                headers: this.config.get('cpo.headers'),
            });
            return result;
        } catch (err) {
            throw Error('GET locations: ' + err.message);
        }
    }

}