var ngModule;
try {
  ngModule = angular.module('wfm.user.directives');
} catch (e) {
  ngModule = angular.module('wfm.user.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/worker.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-content class="wfm-maincol-scroll wfm-maincol-scroll_with-menu">\n' +
    '  <div class="user-info-header" ng-style="ctrl.style">\n' +
    '    <h1 class="md-display-1">{{ctrl.worker.name}}</h1>\n' +
    '  </div> \n' +
    '  <md-list>\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">person</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.username}}</h3>\n' +
    '        <p>Username</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">phone</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.phone}}</h3>\n' +
    '        <p>Phone Number</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">email</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.email}}</h3>\n' +
    '        <p>Email</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-list-item class="md-2-line" >\n' +
    '      <md-icon md-font-set="material-icons">portrait</md-icon>\n' +
    '      <div class="md-list-item-text">\n' +
    '        <h3>{{ctrl.worker.position}}</h3>\n' +
    '        <p>Position</p>\n' +
    '      </div>\n' +
    '      <md-divider></md-divider>\n' +
    '    </md-list-item>\n' +
    '\n' +
    '    <md-subheader class="md-no-sticky">Notes</md-subheader>\n' +
    '    <p class="md-body-1" layout-padding layout-margin>{{ctrl.worker.notes}}</p>\n' +
    '  </md-content>\n' +
    '');
}]);
