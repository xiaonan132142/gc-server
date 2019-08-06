const { write, deleteExpired } = require('./cacheUtil');
const settings = require('../../config/settings');
const { get, post } = require('../utils/ajaxUtil');
const { logger } = require('../middleware/logFactory');
const _ = require('lodash');

async function getUserBasicInfo(phoneNum) {
  try {
    let result = await post(settings.serverUrl + '/api/dapp/getAccessToken', {
      ultrainId: settings.ultrainId,
      secretId: settings.secretId,
    });

    if (result && result.data && result.data.token) {
      let userInfo = await get(settings.serverUrl + '/api/user/getUserBasicInfo?phoneNum=' + phoneNum, null, {
        'x-access-token': result.data.token,
      });
      if (userInfo && userInfo.data && userInfo.data.data && userInfo.data.data.logo) {
        let logo = userInfo.data.data.logo;
        if (!logo.startsWith('http') && !logo.startsWith('data:image')) {
          userInfo.data.data.logo = settings.imageUrl + logo;
        }
      }
      if (userInfo && userInfo.data && userInfo.data.data) {
        userInfo.data.data.name = userInfo.data.data.name || userInfo.data.data.wechatName || userInfo.data.data.facebookName;
      }
      return userInfo;
    }
  } catch (e) {
    logger.error(e);
  }
}

async function deleteExpiredSessionInRedis() {

  await deleteExpired('sess*', () => {
    //console.log("done");
  });
  console.log('redis: expired session was deleted in redis successfully');
}

module.exports = {
  deleteExpiredSessionInRedis,
  getUserBasicInfo,
};
