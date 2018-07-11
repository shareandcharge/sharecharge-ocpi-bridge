import { Arguments } from "yargs";

// register script

/*

    1. Request GET versions (using TOKEN_A as authentication) and store mutual version's modules endpoint
    2. Request GET modules (using TOKEN_A as authentication) and store all 
    3. Request POST credentials with generated TOKEN_B
    4. Receive GET versions (using TOKEN_B as authentication)
    5. Receive GET modules (using TOKEN_B as authentication)
    6. Receive POST credentials and store TOKEN_C for authentication

*/

export default (args: Arguments) => {
    
}