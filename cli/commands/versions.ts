import * as ConfigStore from 'configstore';
import { OCPI } from '../../src/services/ocpi';

const config = new ConfigStore('ocpi');

export default async () => {
    const ocpi = OCPI.getInstance(config);
    const versions = await ocpi.versions.get();
    console.log(JSON.stringify(versions, null, 2));
}