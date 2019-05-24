'use strict';

const ApiCommon = require('./ApiCommon');
const { stringPreview } = require('../utils');


/**
 * 云推送接口。
 */
class CloudPush extends ApiCommon {
  /**
   * @param {{ AppKey:string, AccessKeyId:string, AccessKeySecret:string,
   *    RegionId:string, SignatureMethod:string, SignatureVersion:string, Version:string }} commonArgs
   */
  constructor(commonArgs) {
    commonArgs.Version = commonArgs.Version || '2016-08-01';
    super('https://cloudpush.aliyuncs.com', commonArgs);
  }

  /**
   * 推送高级接口。见
   * [wiki](https://help.aliyun.com/knowledge_detail/48089.html)
   *
   * 本接口设计上是支持 Apple Push 的，但是这里把 Apple Push 相关的参数都抹去了。苹果就一家，何不直接使用 Apns 的接口呢？
   *
   * @typedef { 'VIBRATE' | 'SOUND' | 'BOTH' | 'NONE' } ANotiType
   * @typedef { 'APPLICATION' | 'ACTIVITY' | 'URL' | 'NONE' } AOpenType
   * @typedef { 'DEVICE' | 'ACCOUNT' | 'ALIAS' | 'TAG' | 'ALL' } ATarget
   * @typedef { 'MESSAGE' | 'NOTICE' } APushType
   * @param {{SignatureNonce:string, Timestamp:string, Target:ATarget, TargetValue:string, PushType: APushType,
   *    Title:string, Body:String, AndroidOpenType:AOpenType, AndroidNotifyType:ANotiType, AndroidActivity:string,
   *    AndroidOpenUrl:string, AndroidNotificationBarType:Number, AndroidNotificationBarPriority:number,
   *    AndroidNotificationChannel:string, AndroidExtParameters:string, AndroidRemind:boolean, AndroidPopupActivity:string,
   *    StoreOffline:boolean }} apiArgs
   */
  push(apiArgs) {
    apiArgs.Action = 'Push';
    apiArgs.DeviceType = 'ANDROID';
    apiArgs.AndroidPopupTitle = stringPreview(apiArgs.Title, 15);
    apiArgs.AndroidPopupBody = stringPreview(apiArgs.Body, 127);
    apiArgs.Target = apiArgs.Target ? apiArgs.Target : 'DEVICE';
    apiArgs.PushType = apiArgs.PushType ? apiArgs.PushType : 'NOTICE';
    apiArgs.AndroidOpenType = apiArgs.AndroidOpenType ? apiArgs.AndroidOpenType : 'APPLICATION';
    apiArgs.AndroidNotifyType = apiArgs.AndroidNotifyType ? apiArgs.AndroidNotifyType : 'VIBRATE';
    apiArgs.AndroidNotificationBarType = apiArgs.AndroidNotificationBarType ? apiArgs.AndroidNotificationBarType : 50;
    apiArgs.AndroidNotificationBarPriority = apiArgs.AndroidNotificationBarPriority ? apiArgs.AndroidNotificationBarPriority : 0;
    apiArgs.AndroidRemind = apiArgs.AndroidRemind ? apiArgs.AndroidRemind : true;
    apiArgs.StoreOffline = apiArgs.StoreOffline ? apiArgs.StoreOffline : true;

    return this.applyArgsAndPost(apiArgs);
  }
}

module.exports = CloudPush;
