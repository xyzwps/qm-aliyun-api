/* eslint-disable key-spacing */
'use strict';

const { CloudPush } = require('../index');
const moment = require('moment');

// prettier-ignore
(async () => {
  const cloudPush = new CloudPush({
    AppKey:          process.env.APP_KEY,
    AccessKeyId:     process.env.ACCESS_KEY_ID,
    AccessKeySecret: process.env.ACCESS_KEY_SECRET
  });

  const result = await cloudPush.massPush(
    {
      SignatureNonce: 'xx' + Date.now(),
      Timestamp: moment().toISOString(),
    },
    [
      {
        Target: 'DEVICE',
        TargetValue: process.env.DEVICE_IDS,
        Title: '测试x标题',
        Body: '我要发送个随机内容啊🌶',
        PushType: 'NOTICE',
        AndroidExtParameters: null,
        AndroidActivity:      process.env.ANDROID_ACTIVITY,
        AndroidPopupActivity: process.env.ANDROID_ACTIVITY,
        AndroidNotifyType: 'VIBRATE',
        AndroidOpenType: 'APPLICATION',
      },
      {
        Target: 'DEVICE',
        TargetValue: process.env.DEVICE_IDS,
        Title: '测试x标题',
        Body: '我要发送个随机内容啊🍋',
        PushType: 'NOTICE',
        AndroidExtParameters: null,
        AndroidActivity:      process.env.ANDROID_ACTIVITY,
        AndroidPopupActivity: process.env.ANDROID_ACTIVITY,
        AndroidNotifyType: 'VIBRATE',
        AndroidOpenType: 'APPLICATION',
      }
    ]
  );
  console.log(JSON.stringify(result, null, '   '));
})().catch((err) => {
  console.error(JSON.stringify(err));
  console.error(JSON.stringify(err.body, null, '    '));
});
