import * as request from 'request-promise-native';
import { config } from '../../config/config';
import IResponse from '../ocpi/2.1.1/interfaces/iResponse';

export const send = (method: string, uri: string, body?: any): request.RequestPromise<IResponse> => {
    return request({
        method,
        uri,
        headers: config.headers,
        body,
        json: true
    });
}