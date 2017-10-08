// externalized so it can be mocked easily in unit tests
module.exports.isBrowser = () => typeof window !== 'undefined';
