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

userRest.auth = function(username, password) {
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

userRest.hasSession = function() {
  var deferred = q.defer();
  $fh.auth.hasSession(function(err, exists){
    if(err) {
      console.log('Failed to check session: ', err);
      deferred.reject(err);
    } else if (exists){
      //user is already authenticated
      //optionally we can also verify the session is acutally valid from client. This requires network connection.
      deferred.resolve(true)
    } else {
      deferred.resolve(false);
    }
  });
  return deferred.promise;
}

userRest.clearSession = function() {
  var deferred = q.defer();
  $fh.auth.clearSession(function(err){
    if(err) {
      console.log('Failed to clear session: ', err);
      deferred.reject(err);
    } else {
      deferred.resolve(true);
    }
  });
  return deferred.promise;
}

userRest.verify = function() {
  var deferred = q.defer();
  $fh.auth.verify(function(err, valid){
    if(err){
      console.log('failed to verify session');
      deferred.reject(err);
      return;
    } else if(valid) {
      console.log('session is valid');
      deferred.resolve(true)
    } else {
      console.log('session is not valid');
      deferred.resolve(false);
    }
  });
  return deferred.promise;
}

module.exports = userRest;
