const winston = require("winston");
const expressWinston = require("express-winston");
require("winston-daily-rotate-file");
const settings = require("../../config/settings");
const requestIp = require("request-ip");
const fs = require("fs");
const path = require("path");
const isProd = process.env.NODE_ENV === "production";
const resolve = file => path.resolve(__dirname, file);

export const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};
const LOG_DIR = resolve(settings.logger.directory);
if (!fs.existsSync(LOG_DIR)) {
  mkdirsSync(LOG_DIR);
}

export let DailyRotateFileTransport = () => {
  return new (winston.transports.DailyRotateFile)({
    dirname: LOG_DIR,
    filename: "%DATE%.log",
    maxSize: "50m",
    datePattern: "YYYY-MM-DD",
    zippedArchive: false
  });
};

let transports = [];
if (isProd) {
  transports.push(DailyRotateFileTransport());
} else {
  transports.push(new winston.transports.Console({
    json: true,
    colorize: true
  }));
}

export let logger = winston.createLogger({
  exitOnError: false,
  level: settings.logger.level || "info",
  format: winston.format.combine(
    winston.format.label({ label: "Manual" }),
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(info => `${info.timestamp} [${info.label}] - ${info.level}: ${info.message}`)
  ),
  transports
});

export let requestLogger = (req, res, next) => {
  let clientIp = requestIp.getClientIp(req);
  let send = res.send;
  let status = res.status;
  let state = 200;
  let content = "";
  let query = req.query || {};
  let body = req.body || {};
  res.status = function() {
    state = arguments[0];
    status.apply(res, arguments);
  };
  res.send = function() {
    content = arguments[0];
    send.apply(res, arguments);
  };

  expressWinston.logger({
    transports,
    level: () => {
      return state > 400 ? "error" : "info";
    },
    format: winston.format.combine(
      winston.format.label({ label: "Developer" }),
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(info => `${info.timestamp} [${info.label}] - ${info.level}: ${info.message}`)
    ),
    meta: true,
    msg() {
      if (state > 400) {
        return `${clientIp} HTTP ${req.method} ${req.url} query ${JSON.stringify(query)} body ${JSON.stringify(body)} error ${content}`;
      } else {
        return `${clientIp} HTTP ${req.method} ${req.url} query ${JSON.stringify(query)} body ${JSON.stringify(body)}`;
      }
    },
    colorize: true,
    ignoreRoute: function(req, res) {
      let notPageRequest = false;
      let ignoreArr = ["/backend", "/__webpack_hmr", ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".woff", ".ttf"];
      ignoreArr.forEach(item => {
        if (req.url.indexOf(item) > -1) notPageRequest = true;
      });
      if (req.headers.self) notPageRequest = true;
      return notPageRequest;
    }
  })(req, res, next);
};
