import { Arguments } from "yargs";
import { OCPI, push } from '../../src/services/ocpi';
import * as ConfigStore from 'configstore';
import Helpers from "../../src/helpers/helpers";

const config = new ConfigStore('ocpi');

export default class CmdService {

    static get ocpi(): OCPI {
        const ocpi = OCPI.getInstance(config);
        ocpi.startServer();
        return ocpi;
    }

    static async start(argv: Arguments): Promise<void> {
        const requestId = Math.round(Math.random() * 1000000).toString();
        const token = Helpers.generateToken(config, '0x0');
        const requested = await CmdService.ocpi.commands.startSession(argv.id, argv.evse, token, requestId);
        if (requested !== 'ACCEPTED') {
            console.log('Error requesting session start:', requested);
            process.exit();
        } else {
            console.log('Successfully requested start');
        }
        push.on('start', data => {
            if (data.id === requestId) {
                console.log('Got start push event:', JSON.stringify(data, null, 2));
                CmdService.ocpi.stopServer();
            }
        });
    }

    static async stop(argv: Arguments): Promise<void> {
        const requested = await CmdService.ocpi.commands.stopSession(argv.id);
        if (requested !== 'ACCEPTED') {
            console.log('Error requesting session stop:', JSON.stringify(requested, null, 2));
        } else {
            console.log('Succesfully requested stop');
        }
        push.on('stop', data => {
            if (data.id === argv.id) {
                console.log('Got stop push event:', JSON.stringify(data, null, 2));
                CmdService.ocpi.stopServer();
            }
        });
    }

}