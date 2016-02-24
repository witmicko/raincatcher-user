/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var express = require('express'),
    config = require('./config-membership')

function initRouter(mediator) {
  var router = express.Router();

  router.route('/').get(function(req, res, next) {
    mediator.once('done:rest:membership:list:load', function(data) {
      res.json(data);
    });
    mediator.publish('rest:membership:list:load');
  });
  router.route('/:id').get(function(req, res, next) {
    var membershipId = req.params.id
    mediator.once('done:rest:membership:load:' + membershipId, function(data) {
      res.json(data);
    });
    mediator.publish('rest:membership:load', membershipId);
  });
  router.route('/:id').put(function(req, res, next) {
    var membershipId = req.params.id;
    var membership = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:rest:membership:save:' + membershipId, function(savedmembership) {
      res.json(savedmembership);
    });
    mediator.publish('rest:membership:save', membership);
  });
  router.route('/').post(function(req, res, next) {
    var ts = new Date().getTime();  // TODO: replace this with a proper uniqe (eg. a cuid)
    var membership = req.body;
    membership.createdTs = ts;
    mediator.once('done:rest:membership:create:' + ts, function(createdmembership) {
      res.json(createdmembership);
    });
    mediator.publish('rest:membership:create', membership);
  });
  router.route('/:id').delete(function(req, res, next) {
    var membershipId = req.params.id;
    var membership = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:rest:membership:delete:' + membershipId, function(deletedmembership) {
      res.json(deletedmembership);
    });
    mediator.publish('rest:membership:delete', membership);
  });

  return router;
};

module.exports = function(mediator, app) {
  var router = initRouter(mediator);
  app.use(config.apiPath, router);
}
