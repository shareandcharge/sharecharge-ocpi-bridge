#!/usr/bin/env node

import * as yargs from 'yargs';
import init from './commands/init';
import config from './commands/config';
import register from './commands/register';
import locations from './commands/locations';

const pkg = require('../package.json');

const argv = yargs
    .usage('Usage: sc-ocpi <command> [options]')
    .version(pkg.version)
    .alias('v', 'version')
    .alias('h', 'help')
    .command('init', 'Initialise configuration', {}, init)
    .command('config', 'Get and set configuration values', {}, config)
    .command('register', 'Register on Charge Point Operator (CPO) server', {}, register)
    .command('locations', 'Use the location module', {}, locations)
    .demandCommand(1)
    .argv