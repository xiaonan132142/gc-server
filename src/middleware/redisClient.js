/*!
 * redis client
 */
'use strict';
var settings = require('../../config/settings');
var redisClient = require('redis');
var client = redisClient.createClient(settings.redis_port, settings.redis_host);
client.auth(settings.redis_psd);
client.on("error", function(err) {
  console.log("Error " + err);
});

module.exports = client;
