'use strict';

const { generateToken } = require('./lib/utils');
const cdn = require('./lib/cdn');
const push = require('./lib/push');
const CloudPush = require('./lib/apis/CloudPush');
const Sms = require('./lib/apis/Sms');
const VoiceCall = require('./lib/apis/VoiceCall');

module.exports = {
  generateApiToken: generateToken,
  cdn,
  push,
  Sms,
  VoiceCall,
  CloudPush
};
