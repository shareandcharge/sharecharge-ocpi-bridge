#!/usr/bin/env node

import * as yargs from 'yargs';
import init from './commands/init';
import configBuilder from './commands/config';
import register from './commands/register';
import versions from './commands/versions';
import modules from './commands/modules';
import credentialsBuilder from './commands/credentials';
import tariffs from './commands/tariffs';
import locationsBuilder from './commands/locations';
import locationsHandler from './services/locations';
import tokensBuilder from './commands/tokens';
import sessions from './commands/sessions';
import cmdBuilder from './commands/commands';

const pkg = require('../package.json');

const argv = yargs
    .usage('Usage: sc-ocpi <command> [options]')
    .version(pkg.version)
    .alias('v', 'version')
    .alias('h', 'help')
    .command('init', 'Initialise configuration', {}, init)
    .command('config', 'Get and set configuration values', configBuilder, () => argv.showHelp())
    .command('credentials', 'Query CPO credentials endpoint', credentialsBuilder, () => argv.showHelp())
    .command('commands', 'Control sessions using the commands module', cmdBuilder, () => argv.showHelp())
    .command('register', 'Register on CPO server', {}, register)
    .command('locations', 'Query the CPO locations module', locationsBuilder, locationsHandler)
    .command('modules', 'Query CPO modules endpoint', {}, modules)
    .command('sessions', 'Query CPO sessions endpoint', {}, sessions)
    .command('tariffs', 'Query CPO tariffs endpoint', {}, tariffs)
    .command('tokens', 'Add tokens to CPO cache', tokensBuilder, () => argv.showHelp())
    .command('versions', 'Query CPO versions endpoint', {}, versions)
    .demandCommand(1)
    .argv