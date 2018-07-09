export const ocpiSuccess = (data: any) => {
    return {
        data,
        status_code: 1000,
        status_message: 'Success',
        timestamp: new Date()
    }
}

export const ocpiError = () => {
    return {
        status_code: 2000,
        status_message: 'Generic client error',
        timestamp: new Date()
    }
}