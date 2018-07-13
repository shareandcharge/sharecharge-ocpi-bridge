import { OCPI } from '../../../src/services/ocpi';
import * as ConfigStore from 'configstore';

const config = new ConfigStore('ocpi');
const port = process.env.PORT || 3001;
const ocpi = OCPI.getInstance(config);
ocpi.startServer(() => console.log(`MSP server listening on port ${port}`));