import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import IResponse from '../ocpi/2.1.1/interfaces/iResponse';

export default (TOKEN: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const header = req.header('Authorization');
        if (!header) {
            res.send(<IResponse>{
                status_code: 2000,
                status_message: 'Unauthorized',
                timestamp: new Date()
            });
            return;
        }
        const token = header.split(' ')[1];
        token === TOKEN ? next() : res.send(<IResponse>{
            status_code: 1000,
            status_message: 'Unauthorized',
            timestamp: new Date()
        });
    }
}
