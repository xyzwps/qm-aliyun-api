'use strict';

const { generateToken } = require('./lib/utils');
const cdn = require('./lib/cdn');
const push = require('./lib/push');
const VoiceCall = require('./lib/apis/VoiceCall');

module.exports = {
  generateApiToken: generateToken,
  cdn,
  push,
  VoiceCall
};
