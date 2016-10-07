'use strict';

var express = require('express'),
  config = require('./config-group');

function initRouter(mediator) {
  var router = express.Router();

  router.route('/').get(function(req, res) {
    mediator.once('done:wfm:cloud:group:list', function(data) {
      res.json(data);
    });
    mediator.publish('wfm:cloud:group:list');
  });
  router.route('/:id').get(function(req, res) {
    var groupId = req.params.id;
    mediator.once('done:wfm:cloud:group:read:' + groupId, function(data) {
      res.json(data);
    });
    mediator.publish('wfm:cloud:group:read', groupId);
  });
  router.route('/:id').put(function(req, res) {
    var groupId = req.params.id;
    var group = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:wfm:cloud:group:update:' + groupId, function(savedgroup) {
      res.json(savedgroup);
    });
    mediator.publish('wfm:cloud:group:update', group);
  });
  router.route('/').post(function(req, res) {
    var ts = new Date().getTime();  // TODO: replace this with a proper uniqe (eg. a cuid)
    var group = req.body;
    group.createdTs = ts;
    mediator.once('done:wfm:cloud:group:create:' + ts, function(createdgroup) {
      res.json(createdgroup);
    });
    mediator.publish('wfm:cloud:group:create', group, ts);
  });
  router.route('/:id').delete(function(req, res) {
    var groupId = req.params.id;
    var group = req.body;
    // console.log('req.body', req.body);
    mediator.once('done:wfm:cloud:group:delete:' + groupId, function(deletedgroup) {
      res.json(deletedgroup);
    });
    mediator.publish('wfm:cloud:group:delete', group);
  });

  return router;
}

module.exports = function(mediator, app) {
  var router = initRouter(mediator);
  app.use(config.apiPath, router);
};
