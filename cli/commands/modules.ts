import * as ConfigStore from 'configstore';
import { OCPI } from '../../src/services/ocpi';

const config = new ConfigStore('ocpi');

export default async () => {
    const ocpi = OCPI.getInstance(config);
    const modules = await ocpi.modules.get();
    console.log(JSON.stringify(modules, null, 2));
    config.set('cpo.endpoints', modules.endpoints);
}