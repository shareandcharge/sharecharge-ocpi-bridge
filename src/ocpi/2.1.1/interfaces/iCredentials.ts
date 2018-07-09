export default interface ICredentials {
    url: string;
    token: string;
    party_id: string;
    country_code: string;
    business_details: {
        name: string;
        logo?: any;
        website: string;
    }
}