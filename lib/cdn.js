'use strict';

const moment = require('moment');
const { ulid } = require('ulid');
const { generateToken, excludeNilKey, postForm } = require('./utils');

/**
 * [wiki](https://help.aliyun.com/document_detail/91161.html?spm=a2c4g.11186623.6.707.334c1f52lIJT6O)
 *
 * @param {string} filePath cdn resource path
 * @param {string} accessKeyId
 * @param {string} accessKeySecret
 * @param {'JSON'|'XML'} format just `JSON` and `XML` available, default `JSON`
 * @param {string} nonce a random string, default use ulid
 * @return {Promise<{PushTaskId:string, RequestId:string}>}
 */
async function pushObjectCache(filePath, accessKeyId, accessKeySecret, format = 'JSON', nonce) {
  const query = {
    Action: 'PushObjectCache',
    ObjectPath: filePath,
    ObjectType: 'File',
    Format: format || 'JSON',
    Version: '2018-05-10',
    AccessKeyId: accessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: moment().toISOString(),
    SignatureVersion: '1.0',
    SignatureNonce: nonce || ulid()
  };

  excludeNilKey(query);

  const signature = generateToken('POST', query, accessKeySecret);
  query.Signature = signature;

  return await postForm('https://cdn.aliyuncs.com', query);
}

module.exports = {
  pushObjectCache
};
