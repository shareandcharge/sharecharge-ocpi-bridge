import { Argv } from 'yargs';

export default (yargs: Argv) => yargs
    .usage("Usage: locations <id>")
    .positional('id', {
        describe: 'the unique identifier of the location',
        type: 'string',
    })
    .demandOption('id');
