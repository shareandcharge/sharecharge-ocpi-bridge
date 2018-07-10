import * as request from 'request-promise-native';
import IResponse from '../ocpi/2.1.1/interfaces/iResponse';
import IConfig from '../interfaces/iConfig';

const config: IConfig = require('../../config/config.json');

export const send = (method: string, uri: string, body?: any): request.RequestPromise<IResponse> => {
    return request({
        method,
        uri,
        headers: config.cpo.headers,
        body,
        json: true
    });
}