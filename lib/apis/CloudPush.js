/**
 * @typedef { 'VIBRATE' | 'SOUND' | 'BOTH' | 'NONE' } AndroidNotifyType 通知的提醒方式：
 * - `VIBRATE`：振动 默认值
 * - `SOUND`：声音
 * - `BOTH`：声音和振动
 * - `NONE`：静音
 *
 * @typedef { 'APPLICATION' | 'ACTIVITY' | 'URL' | 'NONE' } AndroidOpenType 点击通知后动作：
 * - `APPLICATION`：打开应用 默认值
 * - `ACTIVITY`：打开应用 `AndroidActivity`
 * - `URL`：打开URL
 * - `NONE`：无跳转
 *
 * @typedef { 'MESSAGE' | 'NOTICE' } PushType 推送类型。
 * - `MESSAGE`：表示消息
 * - `NOTICE`：表示通知
 *
 * @typedef { 'DEVICE' | 'ACCOUNT' | 'ALIAS' | 'TAG' | 'ALL' } PushTarget 推送目标。
 * - `DEVICE`:根据设备推送
 * - `ACCOUNT`:根据账号推送
 * - `ALIAS`:根据别名推送
 * - `TAG`:根据标签推送
 * - `ALL`:推送给全部设备(同一种 `DeviceType` 的两次全推的间隔至少为1秒)
 *
 * @typedef PushArgs
 * @property {string} SignatureNonce 【**必须**】唯一随机数，用于防止网络重放攻击，用户在不同请求间要使用不同的随机数值。
 * @property {string} Timestamp 【**必须**】请求的时间戳。日期格式按照 ISO8601 标准表示，并需要使用 UTC 时间，格式为 `YYYY-MM-DDThh:mm:ssZ`，例如 `2016-02-25T12:00:00Z`（为 UTC 时间 2016年2月25日12点0分0秒）。
 * @property {PushTarget} Target 推送目标类型。默认 `DEVICE`。
 * @property {string} TargetValue 【**必须**】根据 `Target` 来设定，多个值使用逗号分隔，超过限制需要分多次推送。
 * -  `Target`=`DEVICE`，值如 `deviceid111`、`deviceid1111`（最多支持 1000 个）
 * -  `Target`=`ACCOUNT`，值如 `account111`、`account222`（最多支持 100 个）
 * -  `Target`=`ALIAS`，值如 `alias111`、`alias222`（最多支持 1000 个）
 * -  `Target`=`TAG`，支持单 Tag 和多 Tag，格式请参考[标签格式](https://help.aliyun.com/document_detail/30095.html?spm=a2c4g.11186623.2.16.61f4708fmk3kyq)
 * -  `Target`=`ALL`，值为 `ALL`
 * @property {PushType} PushType 推送类型。默认 `NOTICE`。
 * @property {string} Title 【**必须**】推送的标题。
 * @property {string} Body 【**必须**】推送的内容。
 * @property {AndroidOpenType} AndroidOpenType 点击通知后动作。默认 `APPLICATION`。
 * @property {AndroidNotifyType} AndroidNotifyType 通知的提醒方式。默认 `VIBRATE`。
 * @property {string} AndroidActivity 设定通知打开的 activity，仅当 `AndroidOpenType`=`Activity`有效，如：`com.alibaba.cloudpushdemo.bizactivity`。
 * @property {string} AndroidOpenUrl Android 收到推送后打开对应的 url,仅当 `AndroidOpenType`=`URL`有效。
 * @property {number} AndroidNotificationBarType Android 自定义通知栏样式，整数，取值：`[1, 100]`。默认 `50`。
 * @property {number} AndroidNotificationBarPriority Android 通知在通知栏展示时排列位置的优先级 `-2`、`-1`、`0`、`1`、`2`。默认 `0`。
 * @property {string} AndroidNotificationChannel 设置 `NotificationChannel` 参数，具体用途请参考常见问题：[Android 8.0以上设备通知接收不到](https://help.aliyun.com/knowledge_detail/67398.html)
 * @property {string} AndroidExtParameters 设定通知的扩展属性。**注意**: 该参数要以 json map 的格式传入，否则会解析出错。
 * @property {boolean} AndroidRemind 推送类型为消息时设备不在线，则这条推送会使用辅助弹窗功能。默认值为 `true`，仅当 `PushType`=`MESSAGE` 时生效。
 * @property {string} AndroidPopupActivity 此处指定通知点击后跳转的 Activity。
 * @property {boolean} StoreOffline 离线推送是否保存。若保存，在推送时候用户不在线，在过期时间（`ExpireTime`）内用户上线时会被再次发送。`StoreOffline` 默认设置为 `true`，`ExpireTime`默认为 72 小时。
 */
"use strict";

const _ = require("lodash");
const ApiCommon = require("./ApiCommon");
const { stringPreview } = require("../utils");

/**
 * 云推送接口。
 */
class CloudPush extends ApiCommon {
  /**
   * @param {{ AppKey:string, AccessKeyId:string, AccessKeySecret:string,
   *    RegionId:string, SignatureMethod:string, SignatureVersion:string, Version:string }} commonArgs
   */
  constructor(commonArgs) {
    commonArgs.Version = commonArgs.Version || "2016-08-01";
    super("https://cloudpush.aliyuncs.com", commonArgs);
  }

  /**
   * 推送高级接口。见
   * [wiki](https://help.aliyun.com/knowledge_detail/48089.html)
   *
   * 本接口设计上是支持 Apple Push 的，但是这里把 Apple Push 相关的参数都抹去了。苹果就一家，何不直接使用 Apns 的接口呢？
   *
   * @param {PushArgs} apiArgs
   */
  push(apiArgs) {
    apiArgs.Action = "Push";
    apiArgs.DeviceType = "ANDROID";
    apiArgs.AndroidPopupTitle = stringPreview(apiArgs.Title, 15);
    apiArgs.AndroidPopupBody = stringPreview(apiArgs.Body, 127);
    apiArgs.Target = _.get(apiArgs, "Target", "DEVICE");
    apiArgs.PushType = _.get(apiArgs, "PushType", "NOTICE");
    apiArgs.AndroidOpenType = _.get(apiArgs, "AndroidOpenType", "APPLICATION");
    apiArgs.AndroidNotifyType = _.get(apiArgs, "AndroidNotifyType", "VIBRATE");
    apiArgs.AndroidNotificationBarType = _.get(apiArgs, "AndroidNotificationBarType", 50);
    apiArgs.AndroidNotificationBarPriority = _.get(apiArgs, "AndroidNotificationBarPriority", 0);
    apiArgs.AndroidRemind = _.get(apiArgs, "AndroidRemind", true);
    apiArgs.StoreOffline = _.get(apiArgs, "StoreOffline", true);

    return this.applyArgsAndPost(apiArgs);
  }
}

module.exports = CloudPush;
