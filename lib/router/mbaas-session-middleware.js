var session = require('express-session');
var connectMongo = require('connect-mongo');


exports.initSession = function(sessionConfig, cb)
{
  var sess = {};
  console.log('>>>', sessionConfig);


  // return cb(sess);
};


exports.middleware = function(req, res, cb)
{
  cb();
};


// if (_.isFunction(sessionStore)) {
//   // param is the action sessionStore for the session
//   router.sessionStore = sessionStore(session);
// } else if (_.isObject(sessionStore)) {
//   // param is config object for default sessionStore which is connect-mongo
//   var MongoStore = connectMongo(session);
//   router.sessionStore = new MongoStore(sessionStore);
// }
// // don't allow store to be overwritten since it needs to be defined here
// delete expressSessionConfig.store;
// router.expressSessionConfig = _.defaults(expressSessionConfig, {
//   secret: process.env.FH_COOKIE_SECRET || 'raincatcher',
//   store: router.sessionStore,
//   resave: false,
//   cookie: {
//     secure: process.env.NODE_ENV !== 'development'
//   }
// });





