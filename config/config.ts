export let config = {
    version: '2.1.1',
    urls: {
        cpo: 'http://localhost:3000/ocpi/cpo',
        emsp: 'http://localhost:3001/ocpi/emsp'
    },
    getUrl: (party: string, module: string) => `${config.urls[party]}/${config.version}/${module}`,
    // fake!
    TOKEN_A: '69169100-ff32-4313-8b98-f7d2e29bd96b',
    TOKEN_B: 'f1d73bba-3b12-44d8-b0e4-b62d31bf6c9d',
}