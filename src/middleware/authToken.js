const SystemConfigModel = require("../models").SystemConfig;
const requestIp = require("request-ip");

function _clearSession(req) {
  req.session.adminlogined = false;
  req.session.adminPower = "";
  req.session.adminUserInfo = "";
}

module.exports = async (req, res, next) => {

  let clientIp = requestIp.getClientIp(req);
  const authorization = req.session.adminlogined;
  if (!authorization) {
    res.send({ state: "error", err: "tokenExpiredError" });// 登录超时
  } else {
    next();
  }

};
