const moment = require('moment');

const config = require('../config');

function getNow() {
    return config.misc.momentNowDebug ? moment(config.misc.momentNowDebug) : moment();
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    getNow,
    timeout,
};