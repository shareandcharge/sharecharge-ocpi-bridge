import { OCPI } from '../../../src/services/ocpi';
import Config from '../../../src/models/config';

const config: Config = require('../../config/config.json');

const ocpi = OCPI.getInstance(config);
ocpi.startServer(() => console.log('MSP server listening'));