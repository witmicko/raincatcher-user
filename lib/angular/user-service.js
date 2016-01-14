'use strict';

var ngModule = angular.module('wfm.user.services', [])
module.exports = 'wfm.user.services';

var userClient = require('../user-client');

ngModule.factory('userClient', function() {
  return userClient;
});
