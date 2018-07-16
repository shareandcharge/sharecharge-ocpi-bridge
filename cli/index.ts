#!/usr/bin/env node

import * as yargs from 'yargs';
import init from './commands/init';
import config from './commands/config';
import register from './commands/register';
import locations from './commands/locations';
import versions from './commands/versions';
import modules from './commands/modules';
import credentials from './commands/credentials';
import tariffs from './commands/tariffs';

const pkg = require('../package.json');

const argv = yargs
    .usage('Usage: sc-ocpi <command> [options]')
    .version(pkg.version)
    .alias('v', 'version')
    .alias('h', 'help')
    .command('init', 'Initialise configuration', {}, init)
    .command('config', 'Get and set configuration values', config, () => argv.showHelp())
    .command('credentials', 'Query CPO credentials endpoint', credentials, () => argv.showHelp())
    .command('register', 'Register on CPO server', {}, register)
    .command('locations', 'Use the location module', {}, locations)
    .command('modules', 'Query CPO modules endpoint', {}, modules)
    .command('tariffs', 'Query CPO tariffs endpoint', {}, tariffs)
    .command('versions', 'Query CPO versions endpoint', {}, versions)
    .demandCommand(1)
    .argv