import { Request, Response } from 'express';
import { NextFunction } from 'connect';

export default (TOKEN_B: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const header = req.header('Authorization');
        if (!header) {
            res.status(401).send('Unauthorized');
            return;
        }
        const token = header.split(' ')[1];
        token === TOKEN_B ? next() : res.status(401).send('Unauthorized');
    }
}
