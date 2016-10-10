'use strict';

var express = require('express'),
  config = require('./config-membership');

function initRouter(mediator) {
  var router = express.Router();

  router.route('/').get(function(req, res) {
    mediator.once('done:wfm:cloud:membership:list', function(data) {
      res.json(data);
    });
    mediator.publish('wfm:cloud:membership:list');
  });
  router.route('/:id').get(function(req, res) {
    var membershipId = req.params.id;
    mediator.once('done:wfm:cloud:membership:read:' + membershipId, function(data) {
      res.json(data);
    });
    mediator.publish('wfm:cloud:membership:read', membershipId);
  });
  router.route('/:id').put(function(req, res) {
    var membershipId = req.params.id;
    var membership = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:wfm:cloud:membership:update:' + membershipId, function(savedmembership) {
      res.json(savedmembership);
    });
    mediator.publish('wfm:cloud:membership:update', membership);
  });
  router.route('/').post(function(req, res) {
    var ts = new Date().getTime();  // TODO: replace this with a proper uniqe (eg. a cuid)
    var membership = req.body;
    membership.createdTs = ts;
    mediator.once('done:wfm:cloud:membership:create:' + ts, function(createdmembership) {
      res.json(createdmembership);
    });
    mediator.publish('wfm:cloud:membership:create', membership, ts);
  });
  router.route('/:id').delete(function(req, res) {
    var membershipId = req.params.id;
    var membership = req.body;
    // console.log('req.body', req.body);
    mediator.once('wfm:done:cloud:membership:delete:' + membershipId, function(deletedmembership) {
      res.json(deletedmembership);
    });
    mediator.publish('wfm:cloud:membership:delete', membership);
  });

  return router;
}

module.exports = function(mediator, app) {
  var router = initRouter(mediator);
  app.use(config.apiPath, router);
};
