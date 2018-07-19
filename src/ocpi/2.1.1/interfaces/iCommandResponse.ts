export default interface ICommandResponse {
    result: 'NOT_SUPPORTED' | 'REJECTED' | 'ACCEPTED' | 'TIMEOUT' | 'UNKNOWN_SESSION';
}