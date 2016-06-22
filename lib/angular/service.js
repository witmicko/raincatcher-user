'use strict';

var ngModule = angular.module('wfm.user.services', ['wfm.core.mediator'])
module.exports = 'wfm.user.services';

var UserClient = require('../user/user-client'),
    GroupClient = require('../group/group-client'),
    MembershipClient = require('../membership/membership-client');
 
function wrapClient($q, client, methodNames) {
  var wrapper = {};
  methodNames.forEach(function(methodName) {
    wrapper[methodName] = function() {
      return $q.when(client[methodName].apply(client, arguments));
    }
  });
  return wrapper;
}

ngModule.factory('userClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'auth', 'hasSession', 'clearSession', 'verify', 'getProfile'];
  var userClient = wrapClient($q, new UserClient(mediator), methodNames);
  return userClient;
});

ngModule.factory('groupClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'membership'];
  var groupClient = wrapClient($q, new GroupClient(mediator), methodNames);
  return groupClient;
});

ngModule.factory('membershipClient', function($q, mediator) {
  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'membership'];
  var groupClient = wrapClient($q, new MembershipClient(mediator), methodNames);
  return groupClient;
});
