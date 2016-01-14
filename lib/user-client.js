'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config');

var userRest = {};

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

module.exports = userRest;
