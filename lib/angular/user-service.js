'use strict';

var ngModule = angular.module('wfm.user.services', [])
module.exports = 'wfm.user.services';

var _userClient = require('../user-client');

function ClientWrapper($q, _client) {
  this.client = _client;
  var self = this;

  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'auth', 'hasSession', 'clearSession', 'verify'];
  methodNames.forEach(function(methodName) {
    ClientWrapper.prototype[methodName] = function() {
      return $q.when(self.client[methodName].apply(self.client, arguments));
    }
  });
};

ngModule.factory('userClient', function($q) {
  var userClient = new ClientWrapper($q, _userClient);
  return userClient;
});
