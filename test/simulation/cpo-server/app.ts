import * as express from 'express';
import * as bodyParser from 'body-parser';
import versions from './ocpi/versions';
import modules from './ocpi/modules';
import credentials from './ocpi/credentials';

const app = express();
app.use(bodyParser.json());

app.use('/ocpi/cpo/', versions());
app.use('/ocpi/cpo/2.1.1/', modules(), credentials());

app.listen(3005, () => console.log('CPO server listening'));
