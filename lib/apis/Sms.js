/**
 * @typedef SmsArgs
 * @property {string} PhoneNumbers 【**必须**】接收短信的手机号码。格式：
 *
 * - 国内短信：11 位手机号码，例如 `15951955195`。
 * - 国际/港澳台消息：国际区号+号码，例如 `85200000000`。
 *
 * 支持对多个手机号码发送短信，手机号码之间以英文逗号（`,`）分隔。上限为 1000 个手机号码。批量调用相对于单条调用及时性稍有延迟。
 * @property {string} SignName 【**必须**】短信签名名称。请在控制台**签名管理**页面**签名名称**一列查看。
 * @property {string} TemplateCode 【**必须**】短信模板 ID。请在控制台**模板管理**页面**模板CODE**一列查看。
 * @property {{ [key:string]:string }} TemplateParam 短信模板变量对应的实际值，JSON 格式。
 * @property {string} OutId 外部流水扩展字段。
 * @property {string} SmsUpExtendCode 上行短信扩展码，无特殊需要此字段的用户请忽略此字段。
 */
"use strict";

const _ = require("lodash");
const ApiCommon = require("./ApiCommon");

/**
 * 云推送接口。
 */
class Sms extends ApiCommon {
  /**
   * @param {{ AccessKeyId:string, AccessKeySecret:string,
   *    RegionId:string, SignatureMethod:string, SignatureVersion:string, Version:string }} commonArgs
   */
  constructor(commonArgs) {
    commonArgs.Version = commonArgs.Version || "2017-05-25";
    super("https://dysmsapi.aliyuncs.com", commonArgs);
  }

  /**
   * 发送短信接口。见
   * [wiki](https://help.aliyun.com/document_detail/101414.html?spm=a2c4g.11186623.6.616.66b67ce889WM2g)
   *
   * @param {SmsArgs} apiArgs
   */
  sendSms(apiArgs) {
    apiArgs.Action = "SendSms";

    if (_.isEmpty(apiArgs.TemplateParam)) {
      delete apiArgs.TemplateParam;
    } else {
      apiArgs.TemplateParam = JSON.stringify(apiArgs.TemplateParam);
    }

    return this.applyArgsAndPost(apiArgs);
  }
}

module.exports = Sms;
