import IVersions from "../ocpi/2.1.1/interfaces/IVersions";
import IModules from "../ocpi/2.1.1/interfaces/iModules";

export default interface Config {
    version: string;
    cpo: {
        host: string;
        headers: {
            Authorization: string;
        };
    };
    msp: {
        credentials: {
            url: string;
            token: string;
            party_id: string;
            country_code: string;
            business_details: {
                name: string;
            }
        },
        versions: IVersions[],
        modules: IModules
    }
}