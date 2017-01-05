'use strict';

var express = require('express'),
  config = require('./config-group'),
  shortid = require('shortid');

var Topics = require('fh-wfm-mediator/lib/topics');

function initRouter(topics) {
  var router = express.Router();

  router.route('/').get(function(req, res) {
    topics.request('list')
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        throw err;
      });
  });

  router.route('/:id').get(function(req, res) {
    var groupId = req.params.id;

    topics.request('read', groupId)
      .then(function(data) {
        res.json(data);
      }).catch(function(err) {
        throw err;
      });
  });

  router.route('/:id').put(function(req, res) {
    var group = req.body;

    topics.request('update', group, {uid: group.id})
      .then(function(savedgroup) {
        res.json(savedgroup);
      }).catch(function(err) {
        throw err;
      });
  });

  router.route('/').post(function(req, res) {
    var group = req.body;
    group.id = shortid.generate();

    topics.request('create', group, {uid: group.id})
      .then(function(createdgroup) {
        res.json(createdgroup);
      }).catch(function(err) {
        throw err;
      });
  });

  router.route('/:id').delete(function(req, res) {
    var group = req.body;

    topics.request('delete', group, {uid: group.id})
      .then(function(deletedgroup) {
        res.json(deletedgroup);
      }).catch(function(err) {
        throw err;
      });
  });

  return router;
}

module.exports = function(mediator, app) {
  var topics = new Topics(mediator);
  topics.prefix('wfm:cloud').entity(config.dataSetId);
  var router = initRouter(topics);
  app.use(config.apiPath, router);
};
