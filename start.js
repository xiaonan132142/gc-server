//separate from .babelrc, here just for node.js using
require('babel-register')({
    presets: [ 'env' ],
    plugins: ["transform-async-to-generator", "transform-runtime"]
})
module.exports = require('./server.js')