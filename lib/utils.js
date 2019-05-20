'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const got = require('got');

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
  console.log('stringToSign: ' + stringToSign);
  return hmacSha1(stringToSign, `${accessKeySecret}&`);
}

/**
 * @param {string} str 原始字符串
 * @param {number} maxLen 生成的字符串最大长度
 * @returns {string} 如果字符串长度 ≤ `maxLen`，原样返回；否则截断后面加省略号
 */
function stringPreview(str, maxLen) {
  if (_.isEmpty(str)) return '';
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 1) + '…';
}

/**
 * @param {object} obj
 */
function excludeNilKey(obj) {
  if (_.isEmpty(obj) || !_.isPlainObject(obj)) return;

  for (const name in obj) {
    if (_.isNil(obj[name])) {
      Reflect.deleteProperty(obj, name);
    }
  }
}

const string = {
  strictLength(str, min, max) {
    if (!_.isString(str) || str.length < min || str.length > max) {
      throw new Error(`字符串 ${str} 的长度必须在 [${min}, ${max}] 之间`);
    }
    return str;
  }
};

const argsChecker = {
  /**
   * @param {string} value arg value
   * @param {string} argName arg name
   */
  stringNotEmpty: (value, argName) => {
    if (!_.isString(value) || _.isEmpty(value)) throw new Error(`Argument ${argName} should be a non empty string.`);
  },

  /**
   * @param {string} value arg value
   * @param {string} argName arg name
   */
  stringNilOrNotEmpty: (value, argName) => {
    if (_.isNil(value)) return;
    if (!_.isString(value) || _.isEmpty(value)) {
      throw new Error(`Argument ${argName} should be a non empty string or nil.`);
    }
  },

  /**
   * @param {string} value arg value
   * @param {string} argName arg name
   * @param {any[]} options
   */
  oneOf: (value, argName, options) => {
    if (!options.includes(value)) throw new Error(`Argument ${argName} should be one of ${JSON.stringify(options)}`);
  },

  /**
   * @param {string} value arg value
   * @param {string} argName arg name
   * @param {any[]} options
   */
  nilOrOneOf: (value, argName, options) => {
    if (!_.isNil(value) && !options.includes(value)) {
      throw new Error(`Argument ${argName} should be nil or one of ${JSON.stringify(options)}`);
    }
  }
};
/**
 * @param {string} url
 * @param {any} body
 */
async function postForm(url, body) {
  try {
    const response = await got(url, {
      method: 'POST',
      timeout: 10 * 1000,
      form: true,
      json: true,
      body
    });
    return response.body;
  } catch (error) {
    Reflect.deleteProperty(error, 'gotOptions');
    throw error;
  }
}

module.exports = {
  hmacSha1,
  generateToken,
  stringPreview,
  excludeNilKey,
  string,
  argsChecker,
  postForm
};
