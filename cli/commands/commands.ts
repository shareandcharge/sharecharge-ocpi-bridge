import CmdService from '../services/commands';
import { Argv } from 'yargs';

// get and set config values

export default (yargs: Argv) => yargs
    .usage("Usage: commands <command>")
    .demandCommand(1)
    .command('start <id>', 
        'Request session start by location ID', 
        (yargs: Argv) => yargs.positional('id', {
            describe: 'The id of the location to start charging at',
            type: 'string',
        }),
        CmdService.start
    )
    .command('stop <id>', 'Request session stop by session ID',
        (yargs: Argv) => {
            return yargs
                .positional('id', {
                    describe: 'The id of the currently ongoing session',
                    type: 'string',
                })

        }, 
        CmdService.stop)

