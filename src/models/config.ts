import * as ConfigStore from 'configstore';
import IModules from "../ocpi/2.1.1/interfaces/iModules";
import IVersions from "../ocpi/2.1.1/interfaces/IVersions";

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
                    identifier: 'tariffs',
                    url: ''
                }
            ]
        }
    }

    static get default(): Config {
        const config = new Config();
        return {
            version: config.version,
            cpo: config.cpo,
            msp: config.msp
        }
    }
}
