'use strict';

const ApiCommon = require('./ApiCommon');

/**
 * 语音服务接口。
 */
class VoiceCall extends ApiCommon {
  /**
   * @param {{ AccessKeyId:string, AccessKeySecret:string,
   *    RegionId:string, SignatureMethod:string, SignatureVersion:string, Version:string }} commonArgs
   */
  constructor(commonArgs) {
    commonArgs.Version = commonArgs.Version || '2017-05-25';
    super('https://dyvmsapi.aliyuncs.com', commonArgs);
  }

  /**
   * 用于向指定号码发起语音通知，若播放的音频为文本模板（TTS），每次调用时从文本模板转化为音频文件。见
   * [wiki](https://help.aliyun.com/document_detail/114035.html?spm=a2c4g.11186623.2.16.203d66e48hw6TP)
   *
   * @param {{CalledNumber:string, CalledShowNumber:string, TtsCode:string, OutId:string,
   *    PlayTimes:number, TtsParam:string, Volume:number, SignatureNonce:string, Timestamp:string}} apiArgs
   */
  singleCallByTts(apiArgs) {
    apiArgs.Action = 'SingleCallByTts';
    return this.applyArgsAndPost(apiArgs);
  }
}

module.exports = VoiceCall;
