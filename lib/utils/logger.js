const config = require('../../config/config');
module.exports = require('nhsuk-bunyan-logger')(config.appName);
