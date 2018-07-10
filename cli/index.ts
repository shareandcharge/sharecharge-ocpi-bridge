import * as yargs from 'yargs';
import init from './commands/init';

const argv = yargs
    .usage('Usage: sc-ocpi <command> [options]')
    .version('0.0.1')
    .alias('v', 'version')
    .alias('h', 'help')
    .command('init', 'Initialise configuration', {}, init)
    .demandCommand(1)
    .argv