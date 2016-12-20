var session = require('express-session');
var _ = require('lodash');
var sessionProviders = require('../session/providers');
var mongoProvider = require('../session/mongoProvider');

/**
* Function to setup express-session and connect-mongo with the configuration sent from the raincatcher-demo-auth application.
* Default configuration options are also provided.
* @param sessionConfig {object} - the configuration for express-session and connect-mongo
* @callback cb - err, session config for connect-mongo
*/
function init(sessionConfig, cb) {
  if (!(_.isObject(sessionConfig))) {
    return cb(new Error("Session Config is not a valid Object"), null);
  }

  if (sessionConfig && !(sessionProviders.indexOf(sessionConfig.store) !== -1)) {
    return cb(new Error("Session Storage Provider is not supported."), null);
  }

  var expressSessionConfig = _.defaults(sessionConfig, {
    config: _.defaults({
      secret: process.env.FH_COOKIE_SECRET || 'raincatcher',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        path: '/'
      }
    }, mongoProvider.defaultConfig)
  });

  var config = {session: session, options: expressSessionConfig};
  return mongoProvider.init(expressSessionConfig, session, function(err) {
    if (err) {
      return cb(err);
    }
    config.store = mongoProvider.store;
    return cb(null, config);
  });
}


/**
 * Middleware that fills the req.sessionValid boolean
 */
function verifySession(req, res, next) {
  if (!req.body.sessionToken) {
    req.sessionValid = false;
    return next();
  }

  mongoProvider.verifySession(req.body.sessionToken, function(err, valid) {
    if (err) {
      return next(err);
    }
    req.sessionValid = valid;
    return next();
  });
}

function revokeSession(req, res, next) {
  if (!req.body.sessionToken) {
    return next(new Error('sessionToken required'));
  }

  mongoProvider.revokeSession(req.body.sessionToken, next);
}

module.exports = {
  verifySession: verifySession,
  init: init,
  revokeSession: revokeSession
};
