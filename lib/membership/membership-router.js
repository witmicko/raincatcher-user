'use strict';

var express = require('express'),
  config = require('./config-membership'),
  shortid = require('shortid');

var MembershipCloudDataTopics = require('fh-wfm-mediator/lib/topics');

/**
 * Function which handles the response according to the promise returned by the topic
 *
 * @param {Object} res
 * @param {Promise} topicPromise Promise returned by the topic the request was sent to
 */
function handleResponse(res, topicPromise) {
  topicPromise.then(function(data) {
    res.json(data);
  }).catch(function(err) {
    console.log("[Error] Membership topic request: ", err);
    res.status(500).json(err);
  });
}

/**
 * Function which initializes an express router to be used by the app.
 *
 * @param {Object} topics  Object used for sending a request to a topic.
 * @returns {router}
 */
function initRouter(topics) {
  var router = express.Router();

  router.route('/').get(function(req, res) {
    handleResponse(res, topics.request('list'));
  });

  router.route('/:id').get(function(req, res) {
    var membershipId = req.params.id;
    handleResponse(res, topics.request('read', membershipId));
  });

  router.route('/:id').put(function(req, res) {
    var membership = req.body;
    handleResponse(res, topics.request('update', membership, {uid: membership.id}));
  });

  router.route('/').post(function(req, res) {
    var membership = req.body;
    membership.id = shortid.generate(); //Add id field required by the simple-store module
    handleResponse(res, topics.request('create', membership, {uid: membership.id}));
  });

  router.route('/:id').delete(function(req, res) {
    var membership = req.body;
    handleResponse(res, topics.request('delete', membership, {uid: membership.id}));
  });

  return router;
}

module.exports = function(mediator, app) {
  var topics = new MembershipCloudDataTopics(mediator);
  topics.prefix(config.cloudDataTopicPrefix).entity(config.dataSetId);
  var router = initRouter(topics);
  app.use(config.apiPath, router);
};

