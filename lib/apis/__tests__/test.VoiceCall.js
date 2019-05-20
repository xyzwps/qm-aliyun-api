'use strict';

const VoiceCall = require('../VoiceCall');

describe('constructor', () => {
  it('default apiUrl', () => {
    const api = new VoiceCall({ AppKey: 'xx', AccessKeyId: 'xx', AccessKeySecret: 'xx', Version: 'xx' });
    expect(api.apiUrl).toEqual('https://dyvmsapi.aliyuncs.com');
  });
});

describe('singleCallByTts', () => {
  it('default Action', async () => {
    const api = new VoiceCall({ AppKey: 'xx', AccessKeyId: 'xx', AccessKeySecret: 'xx', Version: 'xx' });
    let bodyToSend = null;
    api.send = async (body) => (bodyToSend = body);
    await api.singleCallByTts({});
    expect(bodyToSend.Action).toEqual('SingleCallByTts');
  });
});
