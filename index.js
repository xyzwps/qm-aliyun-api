'use strict';

const { generateToken } = require('./lib/utils');
const cdn = require('./lib/cdn');
const push = require('./lib/push');

module.exports = {
  generateApiToken: generateToken,
  cdn,
  push
};
