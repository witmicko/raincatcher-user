/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var express = require('express'),
    config = require('./config-group')

function initRouter(mediator) {
  var router = express.Router();

  router.route('/').get(function(req, res, next) {
    mediator.once('done:rest:group:list:load', function(data) {
      res.json(data);
    });
    mediator.publish('rest:group:list:load');
  });
  router.route('/:id').get(function(req, res, next) {
    var groupId = req.params.id
    mediator.once('done:rest:group:load:' + groupId, function(data) {
      res.json(data);
    });
    mediator.publish('rest:group:load', groupId);
  });
  router.route('/:id').put(function(req, res, next) {
    var groupId = req.params.id;
    var group = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:rest:group:save:' + groupId, function(savedgroup) {
      res.json(savedgroup);
    });
    mediator.publish('rest:group:save', group);
  });
  router.route('/').post(function(req, res, next) {
    var ts = new Date().getTime();  // TODO: replace this with a proper uniqe (eg. a cuid)
    var group = req.body;
    group.createdTs = ts;
    mediator.once('done:rest:group:create:' + ts, function(createdgroup) {
      res.json(createdgroup);
    });
    mediator.publish('rest:group:create', group);
  });
  router.route('/:id').delete(function(req, res, next) {
    var groupId = req.params.id;
    var group = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:rest:group:delete:' + groupId, function(deletedgroup) {
      res.json(deletedgroup);
    });
    mediator.publish('rest:group:delete', group);
  });

  return router;
};

module.exports = function(mediator, app) {
  var router = initRouter(mediator);
  app.use(config.apiPath, router);
}
