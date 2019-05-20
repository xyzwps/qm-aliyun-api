'use strict';

const { VoiceCall } = require('../index');

(async () => {
  const voiceCall = new VoiceCall({
    AppKey: process.env.APP_KEY,
    AccessKeyId: process.env.ACCESS_KEY_ID,
    AccessKeySecret: process.env.ACCESS_KEY_SECRET
  });

  const result = await voiceCall.singleCallByTts({
    CalledNumber: '15210165352',
    CalledShowNumber: '15210165352',
    TtsCode: 'TTS_10001',
    OutId: 'xx',
    PlayTimes: 2,
    TtsParam: '{"xx":"12"}',
    Volume: 100
  });

  console.log(JSON.stringify(result, null, '   '));
})().catch((err) => {
  console.error(JSON.stringify(err));
  console.error(JSON.stringify(err.body, null, '    '));
});
