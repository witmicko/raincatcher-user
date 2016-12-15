var _ = require('lodash');
var shortid = require('shortid');
var hash = require('./hash');
var ArrayStore = require('fh-wfm-mediator/lib/array-store');
var q = require('q');
q.longStackSupport = process.env.NODE_ENV === 'development';

var verifyErrMessage = 'User not found with supplied credentials';

function findById(id, data) {
  return _.find(data, {id: id});
}
function findByUsername(username, data) {
  return _.find(data, {username: username});
}

function cloneAndCleanup(user) {
  var cloned = _.clone(user);
  delete cloned.password;
  return cloned;
}

function setUserPassword(user, pwd, cb) {
  hash.saltAndHash(pwd, function(err, hashed) {
    if (err) {
      return cb(err);
    }
    user.password = hashed;
    cb(null, user);
  });
}

function Store(datasetId, data) {
  this.data = data;
  this.topic = {};
  this.subscription = {};
  this.datasetId = datasetId;
}

/**
 * Helper function to reset underlying collection for testing
 */
Store.prototype.setAll = function(arr) {
  this.data = arr;
};

Store.prototype.list = ArrayStore.prototype.list;

/**
 * Finds a user by ID
 */
Store.prototype.read = function(id) {
  var user = findById(id, this.data);
  if (!user) {
    return q.reject(new Error('User not found'));
  }
  return q(cloneAndCleanup(user));
};

/**
 * Finds a user by username.
 */
Store.prototype.byUsername = function(username) {
  var user = findByUsername(username, this.data);
  if (!user) {
    return q.reject(new Error('User not found'));
  }
  return q(cloneAndCleanup(user));
};


Store.prototype.create = function(user) {
  user = _.clone(user);
  user.id = shortid.generate();
  var self = this;
  return q.nfcall(setUserPassword, user, user.password).then(function(user) {
    self.data.push(user);
    return cloneAndCleanup(user);
  });
};

/**
 * Updates an user's data, searching by the ID field. The ID field is read-only.
 * Also updates the user's password unconditionally,
 * so this function should only be acessible from a trusted application.
 * @param  {Object} user User data to update
 * @return {Promise}      Promise that resolves to the updated user
 */
Store.prototype.update = function(user) {
  var originalUser = findById(user.id, this.data);
  if (!originalUser) {
    return q.reject(new Error('User not found'));
  }
  delete user.id;
  _.assign(originalUser, user);
  // update password since this should only be called from the portal
  var passwordPromise = user.password ? q.nfcall(setUserPassword, originalUser, user.password) : q(originalUser);
  return passwordPromise.then(cloneAndCleanup);
};

/**
 * Update's a user's password when also given the current password
 * @param  {String} username
 * @param  {String} oldPwd   The user's current password
 * @param  {String} newPwd   The desired new password for the user
 * @return {Promise}          Promise that resolves to the updated user when successful
 * or rejects if the user is not found or the current password does not match.
 * Note that the password field is not readable
 */
Store.prototype.updatePassword = function(username, oldPwd, newPwd) {
  var user = findByUsername(username, this.data);
  if (!user) {
    return q.reject(new Error(verifyErrMessage));
  }
  return q.nfcall(hash.verify, oldPwd, user.password).then(function(match) {
    if (!match) {
      throw new Error();
    }
    return q.nfcall(setUserPassword, user, newPwd);
  }).then(function(user) {
    return cloneAndCleanup(user);
  }).catch(function() {
    return q.reject(new Error(verifyErrMessage));
  });
};

function doVerify(password, user) {
  // user.password here should be the stored hash
  return q.nfcall(hash.verify, password, user.password).then(function(match) {
    if (!match) {
      throw new Error(verifyErrMessage);
    } else {
      return true;
    }
  });
}

/**
 * Verifies if the user with the given username has the supplied password.
 * @param  {String} username
 * @param  {String} password
 * @return {Promise}          A promise that resolves to a boolean of whether the password matches,
 * the promise is also rejected if the user is not found or the password does not match
 */
Store.prototype.verifyPassword = function(username, password) {
  var user = findByUsername(username, this.data);
  if (!user) {
    return q.reject(new Error(verifyErrMessage));
  }
  var delay = 500;
  return q.delay(delay).then(function() {
    return doVerify(password, user);
  });
};

Store.prototype.delete = ArrayStore.prototype.delete;

Store.prototype.listen = function(topicPrefix, mediator) {
  var self = this;
  ArrayStore.prototype.listen.apply(this, arguments);
  // subscribe to extra topics
  self.topic.usernameLoad = 'wfm:user:username:read';
  console.log('Subscribing to mediator topic:', self.topic.usernameLoad);
  self.subscription.usernameLoad = mediator.subscribe(self.topic.usernameLoad, function(username) {
    self.byUsername(username).then(function(user) {
      mediator.publish('done:' + self.topic.usernameLoad + ':' + username, user);
    }).catch(function(err) {
      mediator.publish('error:' + self.topic.usernameLoad + ':' + username, err);
    });
  });
  self.topic.auth = 'wfm:user:auth';
  console.log('Subscribing to mediator topic:', self.topic.auth);
  self.subscription.auth = mediator.subscribe(self.topic.auth, function(data) {
    self.verifyPassword(data.username, data.password).then(function(passwordCorrect) {
      mediator.publish('done:' + self.topic.auth + ':' + data.username, passwordCorrect);
    }).catch(function(err) {
      mediator.publish('error:' + self.topic.auth + ':' + data.username, err.message);
    });
  });
  self.topic.passwordEdit = 'wfm:user:password';
  console.log('Subscribing to mediator topic:', self.topic.passwordEdit);
  self.subscription.passwordEdit = mediator.subscribe(self.topic.passwordEdit, function(data) {
    self.updatePassword(data.username, data.oldPwd, data.newPwd).then(function(user) {
      mediator.publish('done:' + self.topic.passwordEdit + ':' + data.username, user);
    }).catch(function(err) {
      mediator.publish('error:' + self.topic.passwordEdit + ':' + data.username, err.message);
    });
  });
};

Store.prototype.unsubscribe = function() {
  ArrayStore.prototype.unsubscribe.apply(this, arguments);
  // unsubscribe extra topics
  this.mediator.remove(this.topic.usernameLoad, this.subscription.usernameLoad.id);
  this.mediator.remove(this.topic.auth, this.subscription.auth.id);
  this.mediator.remove(this.topic.passwordEdit, this.subscription.passwordEdit.id);
};

module.exports = Store;