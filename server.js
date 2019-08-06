const isProd = process.env.NODE_ENV === 'production';
global.NODE_ENV = isProd;
const express = require('express');
const { requestLogger, logger } = require('./src/middleware/logFactory');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const settings = require('./config/settings');
const { rankStatistic, btcIndexQuery, batchUpdateResult, settlement } = require('./src/schedules');
const app = express();

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Swagger 接口文档',
  },
  host: settings.swaggerUrl,
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./src/routers/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

const classification = require('./src/routers/classification');
const comment = require('./src/routers/comment');
const read = require('./src/routers/read');
const user = require('./src/routers/user');


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Current-Page');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 设置 express 根目录
app.use(requestLogger);
app.use(morgan('dev'));
app.use('/classification', classification);
app.use('/comment', comment);
app.use('/read', read);
app.use('/user', user);

app.get('/', function(req, res) {
  res.send('Hello World');
});

var server = app.listen(settings.serverPort, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('应用实例，访问地址为 http://%s:%s', host, port);
});

rankStatistic();
