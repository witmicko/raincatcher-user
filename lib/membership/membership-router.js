'use strict';

var express = require('express');
var config = require('./config-membership');
var shortid = require('shortid');

var MembershipCloudDataTopics = require('fh-wfm-mediator/lib/topics');
var membershipTopicResponseHandler = require('../router/topicResponseHandler');

/**
 * Function which initializes an express router to be used by the app.
 *
 * @param {Object} membershipCloudDataTopics  Object used for sending a request to a topic.
 * @returns {router}
 */
function initRouter(membershipCloudDataTopics) {
  var router = express.Router();

  router.route('/').get(membershipTopicResponseHandler(function() {
    return membershipCloudDataTopics.request('list');
  }));

  router.route('/:id').get(membershipTopicResponseHandler(function(req) {
    var membershipId = req.params.id;
    return membershipCloudDataTopics.request('read', membershipId);
  }));

  router.route('/:id').put(membershipTopicResponseHandler(function(req) {
    var membership = req.body;
    return membershipCloudDataTopics.request('update', membership, {uid: membership.id});
  }));

  router.route('/').post(membershipTopicResponseHandler(function(req) {
    var membership = req.body;
    membership.id = shortid.generate(); //Add id field required by the simple-store module
    return membershipCloudDataTopics.request('create', membership, {uid: membership.id});
  }));

  router.route('/:id').delete(membershipTopicResponseHandler(function(req) {
    var membership = req.body;
    return membershipCloudDataTopics.request('delete', membership, {uid: membership.id});
  }));

  return router;
}

/**
 * Function to initialize membership router to be used by an express app.
 * @param mediator Object used to send requests to membership cloud data topics
 * @param app An express app
 */
module.exports = function membershipRouterInit(mediator, app) {
  var membershipCloudDataTopics = new MembershipCloudDataTopics(mediator);
  membershipCloudDataTopics.prefix(config.cloudDataTopicPrefix).entity(config.dataSetId);
  var router = initRouter(membershipCloudDataTopics);
  app.use(config.apiPath, router);
};

