'use strict';

const got = require('got');
const moment = require('moment');
const { ulid } = require('ulid');
const { string } = require('./utils');

/**
 * [wiki](https://help.aliyun.com/document_detail/114035.html?spm=a2c4g.11186623.2.16.203d66e48hw6TP)
 *
 * @param {{}} args
 */
async function singleCallByTts(args) {
  const { appKey, accessKeyId, accessKeySecret, format = 'JSON', nonce, timestamp } = args;
  const { calledNumber, calledShowNumber, ttsCode, outId, planTimes, ttsParam, volume } = args;
  const query = {
    AccessKeyId: accessKeyId,
    Action: 'SingleCallByTts',
    AppKey: appKey,
    Format: format || 'JSON',
    RegionId: 'cn-hangzhou',
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: nonce || ulid(),
    SignatureVersion: '1.0',
    Timestamp: timestamp || moment().toISOString(),
    Version: '2017-05-25',

    CalledNumber: calledNumber, //  String  是  13700000000   被叫号码。仅支持中国大陆号码。
    CalledShowNumber: calledShowNumber, //  String  是  4001112222  被叫显号，必须是已购买的号码。
    TtsCode: ttsCode, //  String  是  TTS_10001   文本转语音（TTS）模板ID。可以在文本转语音模板页面查看模板ID。 说明 必须是已审核通过的文本转语音模板。
    OutId: string.strictLength(outId, 1, 15), //  String  否  abcdefgh   预留给调用方使用的ID, 最终会通过在回执消息中将此ID带回给调用方。 字符串类型，长度为1~15个字节。
    PlayTimes: planTimes, //  Integer  否  3   语音通知的播放次数，取值范围为1~3。
    // Speed  Integer  否  5  说明 该参数为废弃参数，暂不支持使用。
    TtsParam: ttsParam, //  String  否  {“AckNum”:”123456”}   文本转语音（TTS）模板变量转换关系，格式为JSON。
    Volume: volume // Integer  否  100   语音通知的播放音量。取值范围为0~100，默认为100。
  };

  excludeNilKey(query);

  const signature = generateToken('POST', query, accessKeySecret);
  query.Signature = signature;

  const response = await got('https://dyvmsapi.aliyuncs.com', {
    method: 'POST',
    timeout: 10 * 1000,
    form: true,
    body: query
  });
  return response.body;
}

module.exports = {
  singleCallByTts
};
