'use strict';

const { cdn } = require('../index');

(async () => {
  try {
    const result = await cdn.pushObjectCache('xx.jpg', process.env.ACCESS_KEY_ID, process.env.ACCESS_KEY_SECRET);

    console.log(JSON.stringify(result, null, '   '));
  } catch (err) {
    console.error(JSON.stringify(err));
    console.error(JSON.stringify(err.message));
    console.error(JSON.stringify(err.body));
    throw err;
  }
})();
