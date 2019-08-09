const path = require('path');
const logPath = path.join(__dirname, '../logs');
const isProd = process.env.NODE_ENV === 'production';
const mongoHost = isProd ? '127.0.0.1' : '13.113.76.217';
const redisHost = isProd ? '127.0.0.1' : '127.0.0.1';
const pass = 'Ultrain721';
const dbname = 'gc';

module.exports = {
  serverPort: 8083,

  // 数据库配置
  DB_URL: 'mongodb://root:' + pass + '@' + mongoHost + ':27017/' + dbname,
  DB: dbname,
  HOST: mongoHost,
  PORT: 27017,
  USERNAME: 'root',
  PASSWORD: pass,

  // redis配置
  openRedis: true, //是否开启,若为true 则下面的信息必须配置正确完整
  redis_host: redisHost,
  redis_port: 6379,
  redis_psd: '',
  redis_db: 0,

  u3Config: {
    httpEndpoint: 'http://pioneer.natapp1.cc',
    httpEndpointHistory: 'http://pioneer-history.natapp1.cc',
    chainId: '20c35b993c10b5ea1007014857bb2b8832fb8ae22e9dcfdc61dacf336af4450f',
    //logger: undefined
  },
  gcAccount: 'ultrainpoint',
  gcAccountPk: '5HwVm37N47bXiWoEP2ZMBL6HCDWuPWmoyvgZAmokvXH5u1Q7Mfo',

  logger: {
    'directory': logPath,
    'level': 'info',
    'console': true,
    'file': true,
  },

  ultrainId: 'ultrain1Qj2zICAtXPF90S',
  secretId: 'sKsTU6AMtpvDIPUJqrVTDmN689bJPnYS',
  serverUrl: 'https://testnet-dev.ultrain.io',
  imageUrl: 'https://testnet-developer.ultrain.io',
  //swaggerUrl: 'gbc-server.playinggame.me',
  swaggerUrl: 'benyasin.s1.natapp.cc',
};
