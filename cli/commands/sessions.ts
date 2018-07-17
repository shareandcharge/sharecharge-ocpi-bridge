import * as ConfigStore from 'configstore';
import { OCPI } from '../../src/services/ocpi';

const config = new ConfigStore('ocpi');

export default async () => {
    const ocpi = OCPI.getInstance(config);
    const sessions = await ocpi.sessions.get();
    console.log(JSON.stringify(sessions, null, 2));
}