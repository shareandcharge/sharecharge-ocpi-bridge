import { Arguments } from 'yargs';
import * as ConfigStore from 'configstore';
import { OCPI } from '../../src/services/ocpi';

const config = new ConfigStore('ocpi');
const ocpi = OCPI.getInstance(config);

export default async (args: Arguments) => {
    const result = await ocpi.locations.get(args.id);
    console.log(JSON.stringify(result, null, 2));
}