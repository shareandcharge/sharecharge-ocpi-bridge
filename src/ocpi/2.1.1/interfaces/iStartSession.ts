import IToken from "./iToken";

export default interface IStartSession {
    response_url: string;
    token: IToken,
    location_id: string;
    evse_uid?: string;
}