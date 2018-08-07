import { Argv } from 'yargs';

export default (yargs: Argv) => yargs
    .usage("Usage: locations <id>")
    .option('id', {
        describe: 'the unique identifier of a single location to get',
        type: 'string',
    })