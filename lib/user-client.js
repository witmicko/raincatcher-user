'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config');

var userRest = {};
var appid = $fh.getFHParams().appid;

var xhr = function(_options) {
  var defaultOptions = {
    path: '/',
    method: 'get',
    contentType: 'application/json'
  }
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.cloud(options, function(res) {
    deferred.resolve(res);
  }, function(message, props) {
    var e = new Error(message);
    e.props = props;
    deferred.reject(e);
  });
  return deferred.promise;
};

userRest.list = function() {
  return xhr({
    path: config.apiPath
  });
};

userRest.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

userRest.update = function(user) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + user.id,
    method: 'put',
    data: JSON.stringify(user)
  });
};

userRest.create = function(user) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: JSON.stringify(user)
  });
};

userRest.login = function(username, password) {
  var deferred = q.defer();
  $fh.auth({
    policyId: 'wfm',
    clientToken: appid,
    params: {
      userId: username,
      password: password
    }
  }, function (res) {
    // res.sessionToken; // The platform session identifier
    // res.authResponse; // The authetication information returned from the authetication service.
    deferred.resolve(res);
  }, function (msg, err) {
    console.log(msg, err);
    var errorMsg = err.message;
    /* Possible errors:
      unknown_policyId - The policyId provided did not match any defined policy. Check the Auth Policies defined. See Auth Policies Administration
      user_not_found - The Auth Policy associated with the policyId provided has been set up to require that all users authenticating exist on the platform, but this user does not exists.
      user_not_approved - - The Auth Policy associated with the policyId provided has been set up to require that all users authenticating are in a list of approved users, but this user is not in that list.
      user_disabled - The user has been disabled from logging in.
      user_purge_data - The user has been flagged for data purge and all local data should be deleted.
      device_disabled - The device has been disabled. No user or apps can log in from the requesting device.
      device_purge_data - The device has been flagged for data purge and all local data should be deleted.
    */
    if (errorMsg == "user_purge_data" || errorMsg == "device_purge_data") {
      // TODO: User or device has been black listed from administration console and all local data should be wiped
      console.log('User or device has been black listed from administration console and all local data should be wiped');
    } else {
      console.log("Authentication failed - " + errorMsg);
      deferred.reject(errorMsg);
    }
  });
  return deferred.promise;
}

module.exports = userRest;
