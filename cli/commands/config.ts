import * as configStore from 'configstore';
import ConfigService from '../services/config';
import { Argv } from 'yargs';

// get and set config values

export default (yargs: Argv) => yargs
    .usage("Usage: sc-ocpi config <command> [options]")
    .demandCommand(1)
    .command('get <key>', 
        'Get configuration values', 
        (yargs: Argv) => yargs.positional('key', {
            describe: 'The configuration key to get (dot-notation can be used to access nested keys)',
            type: 'string'
        }),
        ConfigService.get
    )
    .command('set <key> <value>', 'Set configuration values',
        (yargs: Argv) => {
            return yargs
                .positional('key', {
                    describe: 'The configuration key to set (dot-notation can be used to access nested keys)',
                    type: 'string',
                })
                .positional('value', {
                    describe: 'The value to set the key to',
                })
                .demandOption(['key', 'value'])

        }, 
        ConfigService.set)

