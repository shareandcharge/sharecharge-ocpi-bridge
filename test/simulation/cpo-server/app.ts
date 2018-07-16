import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as ConfigStore from 'configstore';
import versions from './ocpi/versions';
import modules from './ocpi/modules';
import credentials from './ocpi/credentials';
import tariffs from './ocpi/tariffs';

const config = new ConfigStore('ocpi');
const port = process.env.PORT || '3005';

const app = express();
app.use(bodyParser.json());

app.use('/ocpi/cpo/', versions(config, port));
app.use('/ocpi/cpo/2.1.1/', modules(config, port), credentials(config), tariffs(config));


app.listen(port, () => {
    console.log(`CPO server listening on port ${port}`);
    console.log(`Versions: http://localhost:${port}/ocpi/cpo/versions`);
    console.log(`TOKEN_A: ${config.get('cpo.headers.Authorization').split(' ')[1]}`);
});
