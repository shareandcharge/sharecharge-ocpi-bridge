import { Request, Response } from 'express';
import IConfig from '../interfaces/iConfig';
import { NextFunction } from 'connect';

const config: IConfig = require('../../config/config');

export default (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('Authorization');
    if (!header) {
        res.status(401).send('Unauthorized');
        return;
    }
    const token = header.split(' ')[1];
    token === config.msp.credentials.token ? next() : res.status(401).send('Unauthorized');
}