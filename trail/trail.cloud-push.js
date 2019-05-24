'use strict';

const { CloudPush } = require('../index');

(async () => {
  const cloudPush = new CloudPush({
    AppKey: process.env.APP_KEY,
    AccessKeyId: process.env.ACCESS_KEY_ID,
    AccessKeySecret: process.env.ACCESS_KEY_SECRET
  });

  const result = await cloudPush.push({
    Target: 'DEVICE',
    TargetValue: process.env.DEVICE_IDS,
    Title: '测试x标题',
    Body: '这是一条简单的小通知🌶',
    PushType: 'NOTICE',
    AndroidExtParameters: null,
    AndroidActivity: process.env.ANDROID_ACTIVITY,
    AndroidPopupActivity: process.env.ANDROID_ACTIVITY,
    AndroidNotifyType: 'VIBRATE',
    AndroidOpenType: 'APPLICATION',
  });

  console.log(JSON.stringify(result, null, '   '));
})().catch((err) => {
  console.error(JSON.stringify(err));
  console.error(JSON.stringify(err.body, null, '    '));
});
