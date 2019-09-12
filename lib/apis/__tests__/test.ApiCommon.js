'use strict';

const _ = require('lodash');
const ApiCommon = require('../ApiCommon');

/**
 * @param {() => any} func
 * @param {string} message
 */
function checkErrorMessage(func, message) {
  let errorOccurred = false;
  try {
    func();
  } catch (err) {
    expect(err.message).toBe(message);
    errorOccurred = true;
  } finally {
    expect(errorOccurred).toBeTruthy();
  }
}

/**
 * @param {() => any} func
 * @param {string} message
 */
async function willCheckErrorMessage(func, message) {
  let errorOccurred = false;
  try {
    await func();
  } catch (err) {
    expect(err.message).toBe(message);
    errorOccurred = true;
  } finally {
    expect(errorOccurred).toBeTruthy();
  }
}

describe('constructor', () => {
  it('need AccessKeyId', () => {
    checkErrorMessage(
      () => new ApiCommon('url', { AppKey: 'xx' }),
      'Argument AccessKeyId should be a non empty string.'
    );
  });

  it('need AccessKeySecret', () => {
    checkErrorMessage(
      () => new ApiCommon('url', { AppKey: 'xx', AccessKeyId: 'xx' }),
      'Argument AccessKeySecret should be a non empty string.'
    );
  });

  it('need Version', () => {
    const args = { AppKey: 'xx', AccessKeyId: 'xx', AccessKeySecret: 'xx' };
    checkErrorMessage(() => new ApiCommon('url', args), 'Argument Version should be a non empty string.');
  });

  describe('RegionId', () => {
    it('default RegionId', () => {
      const args = { AppKey: 'xx', AccessKeyId: 'xx', AccessKeySecret: 'xx', Version: 'xx' };
      new ApiCommon('url', args);
    });

    it('RegionId = cn-hangzhou', () => {
      const args = {
        AppKey: 'xx',
        AccessKeyId: 'xx',
        AccessKeySecret: 'xx',
        Version: 'xx',
        RegionId: 'cn-hangzhou'
      };
      new ApiCommon('url', args);
    });

    it('unsupported RegionId', () => {
      const args = {
        AppKey: 'xx',
        AccessKeyId: 'xx',
        AccessKeySecret: 'xx',
        Version: 'xx',
        RegionId: 'us-LA'
      };
      checkErrorMessage(() => new ApiCommon('url', args), 'Argument RegionId should be nil or one of ["cn-hangzhou"].');
    });
  });

  describe('SignatureMethod', () => {
    it('default SignatureMethod', () => {
      const args = { AppKey: 'xx', AccessKeyId: 'xx', AccessKeySecret: 'xx', Version: 'xx' };
      new ApiCommon('url', args);
    });

    it('SignatureMethod = HMAC-SHA1', () => {
      const args = {
        AppKey: 'xx',
        AccessKeyId: 'xx',
        AccessKeySecret: 'xx',
        Version: 'xx',
        SignatureMethod: 'HMAC-SHA1'
      };
      new ApiCommon('url', args);
    });

    it('unsupported SignatureMethod', () => {
      const args = {
        AppKey: 'xx',
        AccessKeyId: 'xx',
        AccessKeySecret: 'xx',
        Version: 'xx',
        SignatureMethod: 'sha1hex'
      };
      checkErrorMessage(
        () => new ApiCommon('url', args),
        'Argument SignatureMethod should be nil or one of ["HMAC-SHA1"].'
      );
    });
  });

  describe('SignatureVersion', () => {
    it('default SignatureVersion', () => {
      const args = { AppKey: 'xx', AccessKeyId: 'xx', AccessKeySecret: 'xx', Version: 'xx' };
      new ApiCommon('url', args);
    });

    it('SignatureVersion = 1.0', () => {
      const args = {
        AppKey: 'xx',
        AccessKeyId: 'xx',
        AccessKeySecret: 'xx',
        Version: 'xx',
        SignatureVersion: '1.0'
      };
      new ApiCommon('url', args);
    });

    it('unsupported SignatureVersion', () => {
      const args = {
        AppKey: 'xx',
        AccessKeyId: 'xx',
        AccessKeySecret: 'xx',
        Version: 'xx',
        SignatureVersion: '1.2'
      };
      checkErrorMessage(() => new ApiCommon('url', args), 'Argument SignatureVersion should be nil or one of ["1.0"].');
    });
  });
});

describe('applyArgsAndPost', () => {
  const args = { AppKey: 'xx', AccessKeyId: 'xx', AccessKeySecret: 'xx', Version: 'xx' };
  const api = new ApiCommon('url', args);
  const doNothing = async () => {}; // send nothing
  api.send = doNothing;

  it('need Action', async () => {
    await willCheckErrorMessage(() => api.applyArgsAndPost({}), 'Argument Action should be a non empty string.');
  });

  describe('SignatureNonce', () => {
    it('default SignatureNonce', async () => {
      await api.applyArgsAndPost({ Action: 'xx' });
    });

    it('non empty SignatureNonce', async () => {
      await api.applyArgsAndPost({ Action: 'xx', SignatureNonce: 'xx' });
    });

    it('empty SignatureNonce', async () => {
      await willCheckErrorMessage(
        () => api.applyArgsAndPost({ Action: 'xx', SignatureNonce: '' }),
        'Argument SignatureNonce should be a non empty string or nil.'
      );
    });
  });

  describe('Timestamp', () => {
    it('default Timestamp', async () => {
      await api.applyArgsAndPost({ Action: 'xx' });
    });

    it('non empty Timestamp', async () => {
      await api.applyArgsAndPost({ Action: 'xx', Timestamp: 'xx' });
    });

    it('empty Timestamp', async () => {
      await willCheckErrorMessage(
        () => api.applyArgsAndPost({ Action: 'xx', Timestamp: '' }),
        'Argument Timestamp should be a non empty string or nil.'
      );
    });
  });

  describe('form body', () => {
    it('not empty Action | Timestamp | SignatureNonce | AppKey', async () => {
      let bodyToSend = null;
      api.send = async (body) => (bodyToSend = body);
      await api.applyArgsAndPost({ Action: 'xx' });
      expect(bodyToSend.Action.length > 0).toBeTruthy(); // from applyArgsAndPost args
      expect(bodyToSend.Timestamp.length > 0).toBeTruthy(); // from applyArgsAndPost args
      expect(bodyToSend.SignatureNonce.length > 0).toBeTruthy(); // from applyArgsAndPost args
      expect(bodyToSend.AppKey.length > 0).toBeTruthy(); // from constructor

      // eslint-disable-next-line guard-for-in
      for (const name in bodyToSend) expect(_.isNil(bodyToSend[name])).toBeFalsy();

      expect(bodyToSend.Signature.length > 0).toBeTruthy();

      // eslint-disable-next-line require-atomic-updates
      api.send = doNothing;
    });
  });
});
