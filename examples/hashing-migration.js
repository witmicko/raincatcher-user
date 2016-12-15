/**
 * Example migration to update user passwors to their hashed versions
 */

var hash = require('../lib/user/hash'); // require the hashing functions from inside this module.
var db = require('my-db');

// the `up` name is from [migrate](https://github.com/tj/node-migrate) convention
exports.up = function(done) {
  var updatePromises = db['users'].find().map(function(user) {
    return new Promise(function(resolve, reject) {
      hash.saltAndHash(user.password, function(err, hashed) {
        if (err) {
          return reject(err);
        }
        user.password = hashed;
        db.update(user, function(err, user) {
          if (err) {
            return reject(err);
          }
          return resolve(user);
        });
      });
    });
  });
  Promise.all(updatePromises).then(done);
};