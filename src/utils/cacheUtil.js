const redis = require("../middleware/redisClient");
const { promisify } = require("util");
const { asyncForEach } = require("./helpers");

const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
const setExAsync = promisify(redis.setex).bind(redis);


/**
 * 从cache中取出缓存
 * @param key 键
 * @param callback 回调函数
 */
const read = async function(key) {
  const data = await getAsync(key);
  if (data) {
    return JSON.parse(data);
  }
};
exports.read = read;


/**
 * 将键值对数据缓存起来
 *
 * @param key  键
 * @param value 值
 * @param time 参数可选，以秒为单位
 * @param callback 回调函数
 */
const write = async function(key, value, time) {
  value = JSON.stringify(value);
  if (value) {
    if (!time) {
      await setAsync(key, value);
    } else {
      //将毫秒单位转为秒
      await setExAsync(key, time, value);
    }
  }
};

exports.write = write;


const deleteExpired = async function(key, callback) {
  await redis.keys(key, async (err, rows) => {

    await asyncForEach(rows, async (row, callbackDelete) => {
      const data = await getAsync(row);
      if (data) {
        let obj = JSON.parse(data);
        if (new Date(obj.cookie.expires).getTime() < new Date().getTime()) {
          redis.del(row, callbackDelete);
        }
      }
    }, callback);
  });
};

exports.deleteExpired = deleteExpired;
