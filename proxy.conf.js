const PROXY_CONFIG = {
  '/api': {
    'target': 'http://bot.aigure.com/',
    'secure': false,
    'changeOrigin': true,
    'logLevel': 'debug'
  }
};

module.exports = PROXY_CONFIG;
