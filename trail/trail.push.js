'use strict';

const { push } = require('../index');

(async () => {
  const result = await push.push({
    appKey: process.env.APP_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    format: 'JSON',
    nonce: Date.now() + '',
    deviceIds: process.env.DEVICE_IDS,
    title: '测试标题',
    body: '这是一条简单的小通知😂',
    extParams: null,
    androidActivity: process.env.ANDROID_ACTIVITY,
    // androidChannel,
    androidNotifyType: 'VIBRATE',
    androidOpenType: 'APPLICATION'
  });

  console.log(JSON.stringify(result, null, '   '));
})().catch((err) => {
  console.error(JSON.stringify(err));
  console.error(JSON.stringify(JSON.parse(err.response.body), null, '    '));
});
