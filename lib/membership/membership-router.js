'use strict';

var express = require('express'),
  config = require('./config-membership'),
  shortid = require('shortid');

var Topics = require('fh-wfm-mediator/lib/topics');

function initRouter(topics) {
  var router = express.Router();

  router.route('/').get(function(req, res) {
    topics.request('list')
      .then(function(data) {
        res.json(data);
      }).catch(function(err) {
        throw err;
      });
  });

  router.route('/:id').get(function(req, res) {
    var membershipId = req.params.id;

    topics.request('read', membershipId)
      .then(function(data) {
        res.json(data);
      }).catch(function(err) {
        throw err;
      });
  });

  router.route('/:id').put(function(req, res) {
    var membership = req.body;

    topics.request('update', membership, {uid: membership.id})
      .then(function(savedmembership) {
        res.json(savedmembership);
      }).catch(function(err) {
        throw err;
      });
  });

  router.route('/').post(function(req, res) {
    var membership = req.body;
    membership.id = shortid.generate();

    topics.request('create', membership, {uid: membership.id})
      .then(function(createdmembership) {
        res.json(createdmembership);
      }).catch(function(err) {
        throw err;
      });
  });

  router.route('/:id').delete(function(req, res) {
    var membership = req.body;

    topics.request('delete', membership, {uid: membership.id})
      .then(function(deletedmembership) {
        res.json(deletedmembership);
      }).catch(function(err) {
        throw err;
      });
  });

  return router;
}

module.exports = function(mediator, app) {
  var topics = new Topics(mediator);
  topics.prefix(config.topicPrefix).entity(config.dataSetId);
  var router = initRouter(topics);
  app.use(config.apiPath, router);
};

