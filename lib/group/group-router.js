'use strict';

var express = require('express'),
  config = require('./config-group'),
  shortid = require('shortid');

var GroupCloudDataTopics = require('fh-wfm-mediator/lib/topics');

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
    console.log("[Error] Group topic request: ", err);
    res.status(500).json({error: err.message});
  });
}

/**
 * Function which initializes an express router to be used by the app.
 *
 * @param {Object} groupCloudDataTopics  Object used for sending a request to a topic.
 * @returns {router}
 */
function initRouter(groupCloudDataTopics) {
  var router = express.Router();

  router.route('/').get(function(req, res) {
    handleResponse(res, groupCloudDataTopics.request('list'));
  });

  router.route('/:id').get(function(req, res) {
    var groupId = req.params.id;
    handleResponse(res, groupCloudDataTopics.request('read', groupId));
  });

  router.route('/:id').put(function(req, res) {
    var group = req.body;
    handleResponse(res, groupCloudDataTopics.request('update', group, {uid: group.id}));
  });

  router.route('/').post(function(req, res) {
    var group = req.body;
    group.id = shortid.generate(); //Add id field required by the simple-store module
    handleResponse(res, groupCloudDataTopics.request('create', group, {uid: group.id}));
  });

  router.route('/:id').delete(function(req, res) {
    var group = req.body;
    handleResponse(res, groupCloudDataTopics.request('delete', group, {uid: group.id}));
  });

  return router;
}

module.exports = function(mediator, app) {
  var groupCloudDataTopics = new GroupCloudDataTopics(mediator);
  groupCloudDataTopics.prefix(config.cloudDataTopicPrefix).entity(config.dataSetId);
  var router = initRouter(groupCloudDataTopics);
  app.use(config.apiPath, router);
};
