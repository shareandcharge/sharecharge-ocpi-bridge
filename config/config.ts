export let config = {
    version: '2.1.1',
    host: 'http://localhost:3000/ocpi/cpo/',
    headers: {
        // fake!
        Authorization: 'Token 123'
    },
    credentials: {
        url: 'http://localhost:3001/ocpi/emsp/versions/',
        // fake!
        token: '',
        party_id: 'SNC',
        country_code: 'DE',
        business_details: {
            name: 'Share & Charge'
        }
    },
    // fake!
}