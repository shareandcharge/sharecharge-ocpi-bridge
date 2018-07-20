import { Arguments } from "yargs";
import { OCPI, push } from '../../src/services/ocpi';
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
            console.log('Successfully requested start');
        }
        push.on('start', data => {
            if (data.id === requestId) {
                console.log('Got start push event:', JSON.stringify(data, null, 2));
                ocpi.stopServer();
            }
        });
    }

    static async stop(argv: Arguments): Promise<void> {
        const requested = await ocpi.commands.stopSession(argv.id);
        if (requested.result !== 'ACCEPTED') {
            console.log('Error requesting session stop:', JSON.stringify(requested, null, 2));
        } else {
            console.log('Succesfully requested stop');
        }
        push.on('stop', data => {
            if (data.id === argv.id) {
                console.log('Got stop push event:', JSON.stringify(data, null, 2));
                ocpi.stopServer();
            }
        });
    }

}