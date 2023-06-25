const PROXY_CONFIG = {
  '/api': {
    'target': 'http://localhost:8023/',
    'secure': false,
    'changeOrigin': true,
    'logLevel': 'debug'
  }
};

module.exports = PROXY_CONFIG;
