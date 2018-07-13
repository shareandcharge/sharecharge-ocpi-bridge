# Share & Charge OCPI Bridge

This is the official Open Charge Point Interface (OCPI) bridge for the [sharecharge-core-client](https://github.com/motionwerkGmbH/sharecharge-core-client). 

Version: `2.1.1`

[Read the OCPI Specification here](https://github.com/ocpi/ocpi).


### Setup

Install:
```
npm install -g @motionwerk/sharecharge-ocpi-bridge
```

Initialize:
```
sc-ocpi init
```

Register with Charge Point Operator:
```
sc-ocpi register
```

Edit Core Client configuration to use the OCPI bridge:
```
sc-cli config set bridgePath @motionwerk/sharecharge-ocpi-bridge
```

Run the Core Client:
```
sc-cc
```


### Registration Process

*Offline:*

0. Receive TOKEN_A and versions endpoint via email

*Setup:*

1. Request GET versions (using TOKEN_A as authentication) and store mutual version's modules endpoint
2. Request GET modules (using TOKEN_A as authentication) and store all 
3. Request POST credentials with generated TOKEN_B
4. Receive GET versions (using TOKEN_B as authentication)
5. Receive GET modules (using TOKEN_B as authentication)
6. Receive POST credentials and store TOKEN_C for authentication

*Runtime:*

7. Request with TOKEN_C
8. Receive with TOKEN_B


### Simulation

A mock CPO server can be run using:

```
ts-node test/simulation/cpo-server/app.ts
```

This will start listening on port 3005:

```
curl http://localhost:3005/ocpi/cpo/versions
```

Note that some endpoints, e.g. POST /credentials will request responses from the eMSP server before resolving the request. To run the eMSP server:

```
ts-node test/simulation/msp-server/app.ts
```

This will start listening on port 3001:
```
curl http://localhost:3001/ocpi/emsp/versions
```
