'use strict';

var express = require('express')
  , config = require('../config')
  , q = require('q')
  , $fh = require('fh-mbaas-api')
  , _ = require('lodash')
  ;

var Delegate = function(guid) {
  this.guid = guid;
};

Delegate.prototype.xhr = function (_options) {
  var defaultOptions = {
    guid: this.guid,
    path: '/api/wfm/user',
    method: 'GET',
  };
  var options = _.defaults(_options, defaultOptions);
  var deferred = q.defer();
  $fh.service(options,function(err, data) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve(data);
  });
  return deferred.promise;
}

Delegate.prototype.list = function() {
  return this.xhr({});
};

Delegate.prototype.read = function(id) {
  return this.xhr({
    path: '/api/wfm/user/' + id
  });
};

Delegate.prototype.update = function(user) {
  return this.xhr({
    path: '/api/wfm/user/' + id,
    method: 'PUT',
    params: {
      user: user
    }
  });
};

Delegate.prototype.create = function(user) {
  return this.xhr({
    path: '/api/wfm/user',
    method: 'POST',
    params: {
      user: user
    }
  });
};

function initRouter(guid) {
  var router = express.Router();
  var delegate = new Delegate(guid);

  router.route('/').get(function(req, res, next) {
    delegate.list().then(function(users) {
      res.json(users);
    });
  });
  router.route('/:id').get(function(req, res, next) {
    delegate.read(req.params.id).then(function(user) {
      res.json(user);
    });
  });
  router.route('/:id').put(function(req, res, next) {
    delegate.update(req.body).then(function(user) {
      res.json(user);
    });
  });
  router.route('/').post(function(req, res, next) {
    delegate.create(req.body).then(function(user) {
      res.json(user);
    });
  });

  return router;
};

module.exports = function(app, guid) {
  var router = initRouter(guid );
  app.use(config.apiPath, router);
};
