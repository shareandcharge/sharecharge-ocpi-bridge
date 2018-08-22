# Share & Charge OCPI Bridge

This is the official Open Charge Point Interface (OCPI) bridge for the [sharecharge-core-client](https://github.com/motionwerkGmbH/sharecharge-core-client). 

Version: `2.1.1`

[Read the OCPI Specification here](https://github.com/ocpi/ocpi).


## Setup

**Note: this is already done for the VWFS pilot**


1. Install (for best results use yarn globally):
```
sudo yarn global add @motionwerk/sharecharge-ocpi-bridge
```

2. Initialize:
```
sc-ocpi init
```

3. Register with Charge Point Operator:
```
sc-ocpi register
```

4. Edit Core Client configuration to use the OCPI bridge:
```
sc-cli config set bridgePath @motionwerk/sharecharge-ocpi-bridge
```

5. Run the Core Client:
```
sc-cc start
```


## Registration Process

**Note: this is already done for the VWFS pilot**

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


## Notes

### Locations

The OCPI command modules requires the `uid` of the `evse` to start a charge. It is therefore necessary to overwrite the `evse_id` of the OCPI location data, because the MSP driver app reads and uses this value. 

Therefore, an EVSE changes from:

```json
{
        "uid": "17510039",
        "evse_id": "NL*EVBOX*EEVB-P18090550*17510039",
        "status": "CHARGING",
        "status_schedule": null,
        "capabilities": null,
        "connectors": [
        ]
}
```

to:

```json
{
        "uid": "17510039",
        "evse_id": "17510039",
        "status": "CHARGING",
        "status_schedule": null,
        "capabilities": null,
        "connectors": [
        ]
}
```

Additionally, the bridge needs the location ID to start charging. This is not provided by the Core Client. A mapping is necessary to translate the `scId` into a location `id`:

```
sc-ocpi config set locations.0x123 PB-18090550
```

Where `0x123` is the `scId` and `PB-18090550` is the location ID. 

Validate the location was mapped successfully:

```
sc-ocpi config get locations
```

Which should return:

```json
{
    "0x123": "PB-18090550"
}
```


## Troubleshooting

1. Permission denied when trying to access `.config/configstore/ocpi.json`

This occurs when using sudo on a global npm/yarn install. Change the permissions of the config directory as follows:
```
sudo chmod 777 .config
sudo chmod 777 .config/configstore/
```

