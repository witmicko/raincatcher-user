var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var sessionProviders = require('../config/sessionStorageProviders').providers;
var MongoClient = require('mongodb').MongoClient;
var db;


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

  if (sessionConfig && !(sessionProviders.indexOf(sessionConfig.store) > -1)) {
    return cb(new Error("Session Storage Provider is not supported."), null);
  }

  var expressSessionConfig = _.defaults(sessionConfig, {
    store: MongoStore,
    config: {
      secret: process.env.FH_COOKIE_SECRET || 'raincatcher',
      host: '127.0.0.1',
      port: '27017',
      db: 'session',
      url: 'mongodb://localhost:27017/raincatcher-demo-auth-session-store',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        path: '/'
      }
    }
  });
  var config = {session: session, options: expressSessionConfig, store: new MongoStore(expressSessionConfig.config)};

  // connect to mongodb and cache the connection for validating sessions
  return MongoClient.connect(expressSessionConfig.url, function(err, mongo) {
    if (err) {
      return cb(err);
    }
    db = mongo;
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

  db.collection('sessions').find({
    '_id': {'$eq': req.body.sessionToken}
  }, function(err, doc) {
    req.sessionValid = false;
    // no error, mongo document exists and expires is below current date
    if (!err && doc && doc.expires < new Date()) {
      req.sessionValid = true;
    }
    return next(err);
  });
}

module.exports = {
  verifySession: verifySession,
  init: init
};
