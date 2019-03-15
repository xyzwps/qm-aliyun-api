'use strict';

const { generateToken } = require('./lib/utils');
const cdn = require('./lib/cdn');

module.exports = {
  generateApiToken: generateToken,
  cdn
};
