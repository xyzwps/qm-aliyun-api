'use strict';

const _ = require('lodash');
const got = require('got');
const moment = require('moment');
const {ulid} = require('ulid');
const { generateToken, stringPreview, excludeNilKey } = require('./utils');

/**
 * [wiki](https://help.aliyun.com/knowledge_detail/48089.html)
 *
 * @typedef { 'VIBRATE' | 'SOUND' | 'BOTH' | 'NONE' } ANotiType
 * @typedef { 'APPLICATION' | 'ACTIVITY' | 'URL' | 'NONE' } AOpenType
 * @param {{ extParams:object, deviceIds:string, androidActivity:string, androidOpenType:AOpenType, timestamp:string, androidNotifyType:ANotiType, androidChannel:string, title:string, body:string, appKey:string, accessKeyId:string, accessKeySecret:string, format:'JSON'|'XML', nonce:string }} args
 * @return {Promise<{MessageId:string, RequestId:string}>}
 */
async function push(args) {
  const { appKey, accessKeyId, accessKeySecret, format = 'JSON', nonce, timestamp } = args;
  const { deviceIds, title, body, extParams } = args;
  const { androidActivity, androidChannel, androidNotifyType, androidOpenType } = args;
  const query = {
    AccessKeyId: accessKeyId,
    Action: 'Push',
    AppKey: appKey,
    Format: format || 'JSON',
    RegionId: 'cn-hangzhou',
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: nonce || ulid(),
    SignatureVersion: '1.0',
    Timestamp: timestamp || moment().toISOString(),
    Version: '2016-08-01',

    Target: 'DEVICE', // DEVICE:按设备；ACCOUNT:按账号；ALIAS:按别名；TAG:按标签；ALL:推送给全部设备(同一种DeviceType的两次全推的间隔至少为1秒)
    TargetValue: deviceIds, // 根据 Target 来设定，多个值使用逗号分隔，超过限制需要分多次推送。
    DeviceType: 'ANDROID', // iOS | ANDROID | ALL
    PushType: 'NOTICE', // MESSAGE：表示消息 NOTICE：表示通知
    Title: title, // Android推送时通知/消息的标题以及iOS消息的标题（必填），iOS 10+通知显示标题，[ iOS 8.2 <= iOS系统 < iOS 10 ]替换通知应用名称（选填）
    Body: body, // Android推送时通知的内容/消息的内容；iOS消息/通知内容，推送的内容大小是有限制的，参照 产品限制
    AndroidOpenType: androidOpenType, // 点击通知后动作  APPLICATION：打开应用 默认值  ACTIVITY：打开应用AndroidActivity URL：打开URL  NONE：无跳转
    AndroidNotifyType: androidNotifyType, // VIBRATE：振动 默认值 SOUND：声音 BOTH：声音和振动 NONE：静音

    AndroidActivity: androidActivity, // 设定通知打开的activity，仅当AndroidOpenType="Activity"有效，如：com.alibaba.cloudpushdemo.bizactivity
    AndroidOpenUrl: '', // Android收到推送后打开对应的url,仅当AndroidOpenType="URL"有效
    AndroidNotificationBarType: 50, // Integer 否 Android自定义通知栏样式，取值：1-100
    AndroidNotificationBarPriority: 0, // Integer 否 Android通知在通知栏展示时排列位置的优先级 -2 -1 0 1 2
    AndroidNotificationChannel: androidChannel, // String 否 设置NotificationChannel参数，具体用途请参考常见问题：Android 8.0以上设备通知接收不到
    AndroidExtParameters: _.isEmpty(extParams) ? undefined : JSON.stringify(extParams), // String 否 设定通知的扩展属性。(注意 : 该参数要以 json map 的格式传入,否则会解析出错)

    // 辅助弹窗部分
    AndroidRemind: true, // 推送类型为消息时设备不在线，则这条推送会使用辅助弹窗功能。默认值为False，仅当PushType=MESSAGE时生效。
    AndroidPopupActivity: androidActivity, // String 否 此处指定通知点击后跳转的Activity。注：原AndroidXiaoMiActivity参数已废弃，所有第三方辅助弹窗都由新参数统一支持。
    AndroidPopupTitle: stringPreview(title, 15), // String 否 辅助弹窗模式下Title内容,长度限制:<16字符（中英文都以一个字符计算）；AndroidPopupActivity参数不为空时，该参数必填。注：原AndroidXiaoMiNotifyTitle参数已废弃，所有第三方辅助弹窗都由新参数统一支持。
    AndroidPopupBody: stringPreview(body, 127), // String 否 辅助弹窗模式下Body内容,长度限制:<128字符（中英文都以一个字符计算）；AndroidPopupActivity参数不为空时，该参数必填。注：原AndroidXiaoMiNotifyBody参数已废弃，所有第三方辅助弹窗都由新参数统一支持。

    StoreOffline: true
  };

  excludeNilKey(query);

  const signature = generateToken('POST', query, accessKeySecret);
  query.Signature = signature;

  const response = await got('https://cloudpush.aliyuncs.com', {
    method: 'POST',
    timeout: 10 * 1000,
    form: true,
    body: query
  });
  return response.body;
}

module.exports = {
  push
};
