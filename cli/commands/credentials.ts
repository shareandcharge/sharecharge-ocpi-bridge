import CredentialsService from '../services/credentials';
import { Argv } from 'yargs';

export default (yargs: Argv) => yargs
    .usage("Usage: credentials <command>")
    .demandCommand(1)
    .command('get', 'GET credentials', 
        (yargs: Argv) => yargs,
        CredentialsService.get
    )
    .command('post', 'POST credentials',
        (yargs: Argv) => yargs, 
        CredentialsService.post
    )

