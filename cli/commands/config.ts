import * as configStore from 'configstore';
import ConfigService from '../services/config';
import { Argv } from 'yargs';

// get and set config values

export default (yargs: Argv) => yargs
    .usage("Usage: sc-ocpi config <command> [options]")
    .demandCommand(1)
    .command('get', 'Get configuration values', {}, ConfigService.get)
    .command('set', 'Set configuration values', {}, ConfigService.set)

