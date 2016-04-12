/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var q = require('q');
var _ = require('lodash');
var config = require('./config-membership');

var MembershipClient = function(mediator) {
  this.mediator = mediator;
  this.initComplete = false;
  this.initPromise = this.init();
};

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

MembershipClient.prototype.init = function() {
  var deferred = q.defer();
  var self = this;
  $fh.on('fhinit', function(error, host) {
    if (error) {
      deferred.reject(new Error(error));
      return;
    }
    self.appid = $fh.getFHParams().appid;
    self.initComplete = true;
    deferred.resolve();
  });
  return deferred.promise;
}

MembershipClient.prototype.list = function() {
  return xhr({
    path: config.apiPath
  });
};

MembershipClient.prototype.read = function(id) {
  return xhr({
    path: config.apiPath + '/' + id
  });
};

MembershipClient.prototype.update = function(membership) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + membership.id,
    method: 'put',
    data: membership
  });
};

MembershipClient.prototype.create = function(membership) {
  return xhr({
    path: config.apiPath,
    method: 'post',
    data: membership
  });
};

MembershipClient.prototype.delete = function(membership) {
  var self = this;
  return xhr({
    path: config.apiPath + '/' + membership.id,
    method: 'delete',
    data: membership
  });
};

module.exports = function(mediator) {
  return new MembershipClient(mediator);
}
