'use strict';

var express = require('express');
var config = require('./config-membership');
var shortid = require('shortid');

var MembershipCloudDataTopics = require('fh-wfm-mediator/lib/topics');

/**
 * Function which handles the response according to the promise returned by the topic
 *
 * @param {Object} res
 * @param {Promise} topicPromise Promise returned by the topic the request was sent to
 */
function handleResponse(res, topicPromise) {
  topicPromise.then(function(data) {
    res.status(200).json(data);
  }).catch(function(err) {
    console.log("[Error] Membership topic request: ", err);
    res.status(500).json({error: err.message});
  });
}

/**
 * Function which initializes an express router to be used by the app.
 *
 * @param {Object} membershipCloudDataTopics  Object used for sending a request to a topic.
 * @returns {router}
 */
function initRouter(membershipCloudDataTopics) {
  var router = express.Router();

  router.route('/').get(function(req, res) {
    handleResponse(res, membershipCloudDataTopics.request('list'));
  });

  router.route('/:id').get(function(req, res) {
    var membershipId = req.params.id;
    handleResponse(res, membershipCloudDataTopics.request('read', membershipId));
  });

  router.route('/:id').put(function(req, res) {
    var membership = req.body;
    handleResponse(res, membershipCloudDataTopics.request('update', membership, {uid: membership.id}));
  });

  router.route('/').post(function(req, res) {
    var membership = req.body;
    membership.id = shortid.generate(); //Add id field required by the simple-store module
    handleResponse(res, membershipCloudDataTopics.request('create', membership, {uid: membership.id}));
  });

  router.route('/:id').delete(function(req, res) {
    var membership = req.body;
    handleResponse(res, membershipCloudDataTopics.request('delete', membership, {uid: membership.id}));
  });

  return router;
}

module.exports = function(mediator, app) {
  var membershipCloudDataTopics = new MembershipCloudDataTopics(mediator);
  membershipCloudDataTopics.prefix(config.cloudDataTopicPrefix).entity(config.dataSetId);
  var router = initRouter(membershipCloudDataTopics);
  app.use(config.apiPath, router);
};

