export default interface IModules {
    version: string;
    endpoints: {
        identifier: string,
        url: string;
    }[]
}