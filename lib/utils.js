'use strict';

const _ = require('lodash');
const crypto = require('crypto');

/**
 * @param {'GET'|'POST'} method
 * @param {object} query
 * @return {string}
 */
function generateStringToSign(method, query) {
  const orderedQueryKeys = _(query).keys().sort().value();

  const canonicalizedQueryString = _(orderedQueryKeys)
    .map((key) => encodeUrl(key) + '=' + encodeUrl(query[key]))
    .join('&');

  const stringToSign = `${method}&${encodeUrl('/')}&${encodeUrl(canonicalizedQueryString)}`;
  return stringToSign;
}

/**
 * @param {string} string
 * @param {string} secret
 * @return {string}
 */
function hmacSha1(string, secret) {
  return crypto.createHmac('sha1', secret).update(string).digest('base64');
}

/**
 * @param {string} string
 * @return {string}
 */
function encodeUrl(string) {
  return encodeURIComponent(string)
    .replace(/\!/gi, '%21')
    .replace(/\'/gi, '%27')
    .replace(/\(/gi, '%28')
    .replace(/\)/gi, '%29')
    .replace(/\*/gi, '%2A');
}

/**
 * @param {'GET'|'POST'} method
 * @param {object} query
 * @param {string} accessKeySecret
 * @return {string}
 */
function generateToken(method, query, accessKeySecret) {
  const stringToSign = generateStringToSign(method, query);
  return hmacSha1(stringToSign, `${accessKeySecret}&`);
}

module.exports = {
  generateStringToSign,
  hmacSha1,
  encodeUrl,
  generateToken
};
