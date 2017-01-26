var sinon = require('sinon');
var assert = require('assert');
var proxyquire = require('proxyquire');
var supertest = require('supertest');
var mediator = require('fh-wfm-mediator/lib/mediator');
var express = require('express');
var bodyParser = require('body-parser');
var mockGroupCloudDataTopics = require('../../test/mocks/mockGroupCloudDataTopics');

/**
 * A set of tests for the group router
 */
describe('Group Router Test', function() {
  var app, request, groupRouter;

  //Create a mock of fh-wfm-mediator's topics and stub it's request() function
  var mockTopics = function(mediator) {
    this.mediator = mediator;
  };
  mockTopics.prototype.request = function() {};
  var mockTopicRequest = sinon.stub(mockTopics.prototype, "request", mockGroupCloudDataTopics.request);

  //Mock Data
  var req = {};
  var res = {};
  var mockErr;
  var mockGroupList = [
    {id: "group-test-id-1", name: 'Drivers', role: 'worker'},
    {id: "group-test-id-2", name: 'Back Office', role: 'manager'},
    {id: "group-test-id-3", name: 'Management', role: 'admin'}
  ];
  var groupIdSuc = 'group-test-id-1';
  var groupIdNA = 'group-test-id-NA';
  var groupIdErr = 'group-test-id-ERR';

  beforeEach(function(done) {
    mockTopicRequest.reset();
    app = express();
    app.use(bodyParser.json());
    request = supertest(app);
    groupRouter = proxyquire('./group-router.js', {
      'fh-wfm-mediator/lib/topics': mockTopics
    });
    groupRouter(mediator, app);
    done();
  });

  //List
  it('should return a list of existing groups', function(done) {
    request
      .get('/api/wfm/group/')
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.ok(res, "Expected a result to be received from the list request");
        assert.deepEqual(res.body, mockGroupList, "Expected group list to be returned from the list request");
        sinon.assert.calledWith(mockTopicRequest, 'list');
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Read
  it('should read an existing group', function(done) {
    request
      .get('/api/wfm/group/' + groupIdSuc)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.ok(res, "Expected a result to be received from the read request");
        assert.deepEqual(res.body, mockGroupList[0], "Expected group with the given group id to be returned");
        sinon.assert.calledWith(mockTopicRequest, 'read', groupIdSuc);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an empty object upon reading a non-existing group', function(done) {
    request
      .get('/api/wfm/group/' + groupIdNA)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.ok(res, "Expected a result to be received from the read request");
        assert.deepEqual(res.body, {}, "Expected an empty object upon reading a group that does not exist");
        sinon.assert.calledWith(mockTopicRequest, 'read', groupIdNA);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error if an error occurred when attempting to read a group', function(done) {
    mockErr = {error: "An error occurred during group read"};

    request
      .get('/api/wfm/group/' + groupIdErr)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received when an error occurs during the read request");
        assert.deepEqual(res.body, mockErr, "Expected no results to be received");
        sinon.assert.calledWith(mockTopicRequest, 'read', groupIdErr);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Update
  it('should return the group that was updated', function(done) {
    req = {id: groupIdSuc, name: 'Drivers-UPDATED', role: 'worker'};

    request
      .put('/api/wfm/group/' + groupIdSuc)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.deepEqual(res.body, req, "Expected the updated group to be received");
        sinon.assert.calledWith(mockTopicRequest, 'update', req, {uid: groupIdSuc});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error upon the attempt of updating a non-existing group', function(done) {
    req = {id: groupIdNA, name: 'Drivers-UPDATED', role: 'worker'};
    mockErr = {error: "Group to be updated does not exist"};

    request
      .put('/api/wfm/group/' + groupIdNA)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'update', req, {uid: groupIdNA});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error if an error occurred when attempting to update a group', function(done) {
    req = {id: groupIdErr, name: 'Drivers-UPDATED', role: 'worker'};
    mockErr = {error: "An error occurred during group update"};

    request
      .put('/api/wfm/group/' + groupIdErr)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'update', req, {uid: groupIdErr});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Create
  it('should return the group that was created', function(done) {
    req = {id: 'group-test-generated-id', name: 'New Group', role: 'worker'};

    request
      .post('/api/wfm/group/')
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.deepEqual(res.body, req, "Expected the created group to be received");
        sinon.assert.calledWith(mockTopicRequest, 'create', sinon.match.object, sinon.match.object);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Delete
  it('should return the group that has been deleted', function(done) {
    req = {id: groupIdSuc, name: 'Drivers', role: 'worker'};

    request
      .delete('/api/wfm/group/' + groupIdSuc)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.deepEqual(res.body, req, "Expected the deleted group object to be received");
        sinon.assert.calledWith(mockTopicRequest, 'delete', req, {uid: groupIdSuc});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error upon the attempt of deleting a non-existing group', function(done) {
    req = {id: groupIdNA, name: 'Group-NA', role: 'Role-NA'};
    mockErr = {error: "Group to be deleted does not exist"};

    request
      .delete('/api/wfm/group/' + groupIdNA)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'delete', req, {uid: groupIdNA});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error if an error occurred when attempting to update a group', function(done) {
    req = {id: groupIdErr, name: 'Group-ERR', role: 'Role-ERR'};
    mockErr = {error: "An error occurred during group deletion"};

    request
      .delete('/api/wfm/group/' + groupIdErr)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'delete', req, {uid: groupIdErr});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });
});