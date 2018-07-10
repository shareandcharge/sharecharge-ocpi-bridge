import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

export const port = process.env.PORT || 3001;

export { app };