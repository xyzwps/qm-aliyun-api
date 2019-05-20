'use strict';

const _ = require('lodash');
const moment = require('moment');
const { ulid } = require('ulid');
const {
  generateToken,
  excludeNilKey,
  postForm,
  argsChecker: { stringNotEmpty, stringNilOrNotEmpty, nilOrOneOf }
} = require('../utils');

/**
 * Api Common
 */
class ApiCommon {
  /**
   * @param {string} apiUrl
   * @param {{ AppKey:string, AccessKeyId:string, AccessKeySecret:string,
   *    RegionId:string, SignatureMethod:string, SignatureVersion:string, Version:string }} commonArgs
   */
  constructor(apiUrl, commonArgs) {
    const { AppKey, AccessKeyId, AccessKeySecret } = commonArgs;
    const { RegionId, SignatureMethod, SignatureVersion, Version } = commonArgs;

    stringNotEmpty(AppKey, 'AppKey');
    stringNotEmpty(AccessKeyId, 'AccessKeyId');
    stringNotEmpty(AccessKeySecret, 'AccessKeySecret');
    nilOrOneOf(RegionId, 'RegionId', [ 'cn-hangzhou' ]);
    nilOrOneOf(SignatureMethod, 'SignatureMethod', [ 'HMAC-SHA1' ]);
    nilOrOneOf(SignatureVersion, 'SignatureVersion', [ '1.0' ]);
    stringNotEmpty(Version, 'Version');

    this.queryTemplate = {
      AccessKeyId,
      AppKey,
      Format: 'JSON',
      RegionId: RegionId || 'cn-hangzhou',
      SignatureMethod: SignatureMethod || 'HMAC-SHA1',
      SignatureVersion: SignatureVersion || '1.0',
      Version
    };
    this.AccessKeySecret = AccessKeySecret;
    this.apiUrl = apiUrl;
  }

  /**
   * @param {string} action
   * @param {{SignatureNonce:string, Timestamp:string, Action:string, [key:string]:any}} args
   */
  async applyArgsAndPost(args) {
    const { SignatureNonce, Timestamp, Action } = args;
    stringNotEmpty(Action, 'Action');
    stringNilOrNotEmpty(SignatureNonce, 'SignatureNonce');
    stringNilOrNotEmpty(Timestamp, 'Timestamp');

    const query = _.cloneDeep(this.queryTemplate);
    query.Action = Action;
    query.SignatureNonce = SignatureNonce || ulid();
    query.Timestamp = Timestamp || moment().toISOString();
    Object.assign(query, args);
    excludeNilKey(query);
    query.Signature = generateToken('POST', query, this.AccessKeySecret);

    return await postForm(this.apiUrl, query);
  }
}

module.exports = ApiCommon;
