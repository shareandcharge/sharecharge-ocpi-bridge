import { Arguments } from "yargs";
import { OCPI } from '../../src/services/ocpi';
import * as ConfigStore from 'configstore';

const config = new ConfigStore('ocpi');
const ocpi = OCPI.getInstance(config);
ocpi.startServer();


export default class CmdService {

    static async start(argv: Arguments): Promise<void> {
        const requestId = Math.round(Math.random() * 1000000).toString();
        const requested = await ocpi.commands.startSession(argv.id, requestId);
        if (requested.result !== 'ACCEPTED') {
            console.log('Error requesting session start:', requested.result);
            process.exit();
        } else {
            console.log('Requested start');
        }
        ocpi.commands.started$.subscribe(started => {
            console.log('started1:', started);
            if (started.id === requestId) {
                console.log('Started2:', JSON.stringify(started, null, 2));
            }
        });
    }

    static async stop(argv: Arguments): Promise<void> {
        ocpi.commands.stopped$.subscribe(stopped => {
            if (stopped.id === argv.id) {
                console.log('Stopped:', JSON.stringify(stopped, null, 2));
            }
        });
        const requested = await ocpi.commands.stopSession(argv.id);
        if (requested.result === 'ACCEPTED') {
            console.log('Error requesting session stop:', JSON.stringify(requested, null, 2));
        }
    }

}