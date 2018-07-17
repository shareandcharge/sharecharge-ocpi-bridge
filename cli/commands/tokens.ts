import TokensService from '../services/tokens';
import { Argv } from 'yargs';

export default (yargs: Argv) => yargs
    .usage("Usage: tokens <command>")
    .demandCommand(1)
    .command('get <uid>', 'GET tokens', 
        (yargs: Argv) => yargs
            .positional('uid', {
                describe: 'The UID of the token to GET',
                type: 'string'
            }),
        TokensService.get
    )
    .command('put', 'PUT tokens',
        (yargs: Argv) => yargs, 
        TokensService.put
    )

