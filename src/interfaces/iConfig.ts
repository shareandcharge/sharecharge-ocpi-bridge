import IVersions from "../ocpi/2.1.1/interfaces/IVersions";
import IModules from "../ocpi/2.1.1/interfaces/iModules";

export default interface Config {
    version: string;
    cpo: {
        versions: string;
        headers: {
            Authorization: string;
        };
        modules: string;
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