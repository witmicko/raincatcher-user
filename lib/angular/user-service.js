'use strict';

var ngModule = angular.module('wfm.user.services', ['wfm.core.mediator'])
module.exports = 'wfm.user.services';

var UserClient = require('../user-client');

function ClientWrapper($q, _client) {
  this.client = _client;
  var self = this;

  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'auth', 'hasSession', 'clearSession', 'verify', 'getProfile'];
  methodNames.forEach(function(methodName) {
    ClientWrapper.prototype[methodName] = function() {
      return $q.when(self.client[methodName].apply(self.client, arguments));
    }
  });
};

ngModule.factory('userClient', function($q, mediator) {
  var userClient = new ClientWrapper($q, new UserClient(mediator));
  return userClient;
});
