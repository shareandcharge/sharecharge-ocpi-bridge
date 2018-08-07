import * as ConfigStore from 'configstore';
import IModules from "../ocpi/2.1.1/interfaces/iModules";
import IVersions from "../ocpi/2.1.1/interfaces/IVersions";
import IToken from '../ocpi/2.1.1/interfaces/iToken';

export default class Config {

    public version = '2.1.1';
    
    public cpo = {
        versions: '',
        headers: {
            Authorization: '',
        },
        modules: '',
        endpoints: <IModules["endpoints"]>[]
    };

    public msp = {
        credentials: {
            url: '',
            token: '',
            party_id: '',
            country_code: '',
            business_details: {
                name: '',
            }
        },
        versions: <IVersions[]>[
            {
                version: '2.1.1',
                url: ''
            }
        ],
        modules: <IModules>{
            version: '2.1.1',
            endpoints: [
                {
                    identifier: 'credentials',
                    url: '',
                },
                {
                    identifier: 'sessions',
                    url: ''
                },
                {
                    identifier: 'commands',
                    url: ''
                },
                {
                    identifier: 'cdrs',
                    url: ''
                }
            ]
        },
        tokens: <{[driver: string]: IToken}>{}
    }

    public locations = {};
    public pullInterval = 60;

    static get default(): Config {
        const config = new Config();
        return {
            version: config.version,
            cpo: config.cpo,
            msp: config.msp,
            locations: config.locations,
            pullInterval: config.pullInterval,
        }
    }
}
