export default interface IResponse {
    data?: any,
    status_code: number;
    status_message?: string;
    timestamp: Date;
}