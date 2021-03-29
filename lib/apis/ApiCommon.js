'use strict';

const _ = require('lodash');
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

    stringNotEmpty(AccessKeyId, 'AccessKeyId');
    stringNotEmpty(AccessKeySecret, 'AccessKeySecret');
    stringNotEmpty(Version, 'Version');
    nilOrOneOf(RegionId, 'RegionId', [ 'cn-hangzhou' ]);
    nilOrOneOf(SignatureMethod, 'SignatureMethod', [ 'HMAC-SHA1' ]);
    nilOrOneOf(SignatureVersion, 'SignatureVersion', [ '1.0' ]);

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
    query.Timestamp = Timestamp || new Date().toISOString();
    Object.assign(query, args);
    excludeNilKey(query);
    query.Signature = generateToken('POST', query, this.AccessKeySecret);

    try {
      return await this.send(query);
    } catch (error) {
      if (_.isPlainObject(error.body)) error.aliApiError = error.body;
      throw error;
    }
  }

  /**
   * @param {{[key:string]:any}} body
   */
  async send(body) {
    return postForm(this.apiUrl, body);
  }
}

module.exports = ApiCommon;
