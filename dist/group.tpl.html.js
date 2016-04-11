var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/group.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.id}}</h3>\n' +
    '      <p>Group id</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.name}}</h3>\n' +
    '      <p>Group name</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '\n' +
    '  <md-list-item class="md-2-line" >\n' +
    '    <md-icon md-font-set="material-icons">group</md-icon>\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{ctrl.group.role}}</h3>\n' +
    '      <p>Role</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '\n' +
    '<md-toolbar class="content-toolbar">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>\n' +
    '      Members\n' +
    '    </h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '<md-list>\n' +
    '  <md-list-item class="md-2-line" ng-click="ctrl.selectMember($event, member)" ng-repeat="member in ctrl.members">\n' +
    '    <img alt="user.name" ng-src="{{member.avatar}}" class="md-avatar" />\n' +
    '    <div class="md-list-item-text">\n' +
    '      <h3>{{member.name}}</h3>\n' +
    '      <p>{{member.position}}</p>\n' +
    '    </div>\n' +
    '    <md-divider></md-divider>\n' +
    '  </md-list-item>\n' +
    '</md-list>\n' +
    '');
}]);
