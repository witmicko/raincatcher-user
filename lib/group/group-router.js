'use strict';

var express = require('express'),
  config = require('./config-group'),
  shortid = require('shortid');

var GroupCloudDataTopics = require('fh-wfm-mediator/lib/topics');
var groupTopicResponseHandler = require('../router/topicResponseHandler');

/**
 * Function which initializes an express router to be used by the app.
 *
 * @param {Object} groupCloudDataTopics  Object used for sending a request to a topic.
 * @returns {router}
 */
function initRouter(groupCloudDataTopics) {
  var router = express.Router();

  router.route('/').get(groupTopicResponseHandler(function() {
    return groupCloudDataTopics.request('list');
  }));

  router.route('/:id').get(groupTopicResponseHandler(function(req) {
    var groupId = req.params.id;
    return groupCloudDataTopics.request('read', groupId);
  }));

  router.route('/:id').put(groupTopicResponseHandler(function(req) {
    var group = req.body;
    return groupCloudDataTopics.request('update', group, {uid: group.id});
  }));

  router.route('/').post(groupTopicResponseHandler(function(req) {
    var group = req.body;
    group.id = shortid.generate(); //Add id field required by the simple-store module
    return groupCloudDataTopics.request('create', group, {uid: group.id});
  }));

  router.route('/:id').delete(groupTopicResponseHandler(function(req) {
    var group = req.body;
    return groupCloudDataTopics.request('delete', group, {uid: group.id});
  }));

  return router;
}

/**
 * Function to initialize group router to be used by an express app.
 * @param mediator Object used with Topics in order to send requests to group cloud data topics
 * @param app An express app
 */
module.exports = function groupRouterInit(mediator, app) {
  var groupCloudDataTopics = new GroupCloudDataTopics(mediator);
  groupCloudDataTopics.prefix(config.cloudDataTopicPrefix).entity(config.dataSetId);
  var router = initRouter(groupCloudDataTopics);
  app.use(config.apiPath, router);
};
