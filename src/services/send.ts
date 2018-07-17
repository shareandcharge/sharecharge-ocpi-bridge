import * as request from 'request-promise-native';

export default async (options: { method: string; uri: string; headers: { Authorization: string; }; body?: any; json?: boolean }): Promise<any> => {
    options.json = true;
    const result = await request(options);
    if (result.status_code === 1000) {
        return result.data;
    } else {
        throw Error(`${result.status_code} - ${result.status_message}`);
    }
}