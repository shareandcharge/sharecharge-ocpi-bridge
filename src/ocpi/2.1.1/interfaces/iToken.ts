export default interface IToken {
    uid: string;
    type: 'OTHER' | 'RFID';
    auth_id: string;
    visual_number?: string;
    issuer: string;
    valid: boolean;
    whitelist: 'ALWAYS' | 'ALLOWED' | 'ALLOWED_OFFLINE' | 'NEVER';
    language?: string;
    last_updated: Date;
}