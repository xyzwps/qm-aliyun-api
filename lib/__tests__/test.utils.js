'use strict';

const { generateToken } = require('../utils');
const urlParse = require('url-parse');

test('generateToken: mobile push - GetDeviceInfos', () => {
  // 用例来源：https://help.aliyun.com/knowledge_detail/72024.html?spm=a2c4g.11186631.2.4.714e641c5gUp6X
  const url =
    'http://cloudpush.aliyuncs.com/?Format=XML&AccessKeyId=testid&Action=GetDeviceInfos&' +
    'SignatureMethod=HMAC-SHA1&RegionId=cn-hangzhou&Devices=e2ba19de97604f55b16557673647' +
    '7b74%2C92a1da34bdfd4c9692714917ce22d53d&SignatureNonce=c4f5f0de-b3ff-4528-8a89-fa47' +
    '8bda8d80&SignatureVersion=1.0&Version=2016-08-01&AppKey=23267207&Timestamp=2016-03-' +
    '29T03%3A59%3A24Z';
  const { query } = urlParse(url, true);
  const expected = 'D6ldYxo/chwOlfv8Ug8REyWU0mk=';
  expect(generateToken('GET', query, 'testsecret')).toBe(expected);
});

test('generateToken: CDN - java', () => {
  // 用例来源：http://docs-aliyun.cn-hangzhou.oss.aliyun-inc.com/assets/attach/27149/cn_zh/1504765657536/SignatureUtils%281%29.java?spm=a2c4g.11186623.2.25.46d225a0gBes72&file=SignatureUtils%281%29.java
  const query = {
    AccessKeyId: 'testid',
    Format: 'JSON',
    Version: '2014-11-11',
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: '9b7a44b0-3be1-11e5-8c73-08002700c460',
    Timestamp: '2015-08-06T02:19:46Z',
    Action: 'DescribeCdnService'
  };
  const expected = 'KkkQOf0ymKf4yVZLggy6kYiwgFs=';
  expect(generateToken('GET', query, 'testsecret')).toBe(expected);
});

test('generateToken: E-MapReduce', () => {
  // 用例来源：https://help.aliyun.com/document_detail/28139.html?spm=5176.10695662.1996646101.searchclickresult.486643e6DJrYID
  const url =
    'http://ecs.aliyuncs.com/?TimeStamp=2016-02-23T12:46:24Z&Format=XML&AccessKeyId=testid&Action=DescribeRegions&SignatureMethod=HMAC-SHA1&SignatureNonce=3ee8c1b8-83d3-44af-a94f-4e0ad82fd6cf&Version=2014-05-26&SignatureVersion=1.0';
  const { query } = urlParse(url, true);
  const expected = 'CT9X0VtwR86fNWSnsc6v8YGOjuE=';
  expect(generateToken('GET', query, 'testsecret')).toBe(expected);
});
