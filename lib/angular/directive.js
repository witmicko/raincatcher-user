'use strict';

var ngModule = angular.module('wfm.user.directives', ['wfm.core.mediator']);
module.exports = 'wfm.user.directives';

require('../../dist');

ngModule.directive('workerList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker-list.tpl.html')
  , scope: {
      workers : '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.workers = $scope.workers;
      self.selected = $scope.selectedModel;
      self.selectWorker = function(event, worker) {
        mediator.publish('wfm:worker:selected', worker);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isWorkerShown = function(worker) {
        return self.shownWorker === worker;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.workers = $scope.workers.filter(function(worker) {
          return String(worker.id).indexOf(term) !== -1
            || String(worker.name).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})
.directive('worker', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker.tpl.html')
  , scope: {
      worker : '=',
      group : '='
    }
  , controller: function($scope) {
      var self = this;
      self.worker = $scope.worker;
      self.group = $scope.group;
      var bannerUrl = self.worker.banner || self.worker.avatar;
      self.style = {
        'background-image': 'url(' + bannerUrl + ')',
        'background-position': self.worker.banner ? 'center center' : 'top center',
        'background-size': self.worker.banner ? 'auto' : 'contain',
        'background-repeat': 'no-repeat'
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('workerForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/worker-form.tpl.html')
  , scope: {
      worker : '=value',
      groups : '='
    }
  , controller: function($scope) {
      var self = this;
      self.groups = $scope.groups;
      self.model = angular.copy($scope.worker);
      self.submitted = false;
      self.selectWorker = function(event, worker) {
        if(worker.id) {
          mediator.publish('wfm:worker:selected', worker);
        }
        else {
          mediator.publish('wfm:worker:list');
        }
        event.preventDefault();
        event.stopPropagation();
      }
      self.done = function(isValid) {
        self.submitted = true;
        if (isValid) {
          if (!self.model.id && self.model.id !== 0) {
            mediator.publish('wfm:worker:created', self.model);
          } else {
            mediator.publish('wfm:worker:updated', self.model);
          }
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('groupList', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/group-list.tpl.html')
  , scope: {
      groups : '=',
      selectedModel: '='
    }
  , controller: function($scope) {
      var self = this;
      self.groups = $scope.groups;
      self.selected = $scope.selectedModel;
      self.selectGroup = function(event, group) {
        mediator.publish('wfm:group:selected', group);
        event.preventDefault();
        event.stopPropagation();
      }
      self.isGroupShown = function(group) {
        return self.shownGroup === group;
      };

      self.applyFilter = function(term) {
        term = term.toLowerCase();
        self.groups = $scope.groups.filter(function(group) {
          return String(group.id).indexOf(term) !== -1
            || String(group.name).toLowerCase().indexOf(term) !== -1;
        });
      };
    }
  , controllerAs: 'ctrl'
  };
})
.directive('group', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/group.tpl.html')
  , scope: {
      group : '=',
      members : '='
    }
  , controller: function($scope) {
      var self = this;
      self.group = $scope.group;
      self.members = $scope.members;
      self.selectMember = function(event, member) {
        mediator.publish('wfm:worker:selected', member);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('groupForm', function($templateCache, mediator) {
    return {
      restrict: 'E'
    , template: $templateCache.get('wfm-template/group-form.tpl.html')
    , scope: {
        group : '=value'
      }
    , controller: function($scope) {
        var self = this;
        self.model = angular.copy($scope.group);
        self.submitted = false;
        self.selectGroup = function(event, group) {
          if(group.id) {
            mediator.publish('wfm:group:selected', group);
          }
          else {
            mediator.publish('wfm:group:list');
          }
          event.preventDefault();
          event.stopPropagation();
        }
        self.done = function(isValid) {
          self.submitted = true;
          if (isValid) {
            if (!self.model.id && self.model.id !== 0) {
              mediator.publish('wfm:group:created', self.model);
            } else {
              mediator.publish('wfm:group:updated', self.model);
            }
          }
        }
      }
    , controllerAs: 'ctrl'
    };
  });
