[Read the OCPI Specification here](https://github.com/ocpi/ocpi)

### Process:

*Offline:*

0. Receive TOKEN_A and versions endpoint via email

*Setup:*

1. Request GET versions (using TOKEN_A as authentication) and store mutual version's modules endpoint
2. Request GET modules (using TOKEN_A as authentication) and store all 
3. Request POST credentials with generated TOKEN_B
4. Receive GET versions
5. Receive GET modules
6. Receive POST credentials and store TOKEN_C for authentication

*Runtime:*

7. Request with TOKEN_C
8. Receive with TOKEN_B