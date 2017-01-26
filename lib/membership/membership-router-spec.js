var sinon = require('sinon');
var assert = require('assert');
var proxyquire = require('proxyquire');
var supertest = require('supertest');
var mediator = require('fh-wfm-mediator/lib/mediator');
var express = require('express');
var bodyParser = require('body-parser');
var mockMembershipCloudDataTopics = require('../../test/mocks/mockMembershipCloudDataTopics');

/**
 * A set of tests for the membership router
 */
describe('Membership Router Test', function() {
  var app, request, membershipRouter;

  //Create a mock of fh-wfm-mediator's topics and stub it's request() function
  var mockTopics = function(mediator) {
    this.mediator = mediator;
  };
  mockTopics.prototype.request = function() {};
  var mockTopicRequest = sinon.stub(mockTopics.prototype, "request", mockMembershipCloudDataTopics.request);

  //Mock Data
  var req = {};
  var res = {};
  var mockErr;
  var mockMembershipList = [
    {id: "membership-test-id-1", group: 'test-group-1', user: 'test-user-1'},
    {id: "membership-test-id-2", group: 'test-group-2', user: 'test-user-2'},
    {id: "membership-test-id-3", group: 'test-group-3', user: 'test-user-3'}
  ];
  var membershipIdSuc = 'membership-test-id-1';
  var membershipIdNA = 'membership-test-id-NA';
  var membershipIdErr = 'membership-test-id-ERR';

  beforeEach(function(done) {
    mockTopicRequest.reset();
    app = express();
    app.use(bodyParser.json());
    request = supertest(app);
    membershipRouter = proxyquire('./membership-router.js', {
      'fh-wfm-mediator/lib/topics': mockTopics
    });
    membershipRouter(mediator, app);
    done();
  });

  //List
  it('should return a list of existing memberships', function(done) {
    request
      .get('/api/wfm/membership/')
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.ok(res, "Expected a result to be received from the list request");
        assert.deepEqual(res.body, mockMembershipList, "Expected membership list to be returned from the list request");
        sinon.assert.calledWith(mockTopicRequest, 'list');
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Read
  it('should read an existing membership', function(done) {
    request
      .get('/api/wfm/membership/' + membershipIdSuc)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.ok(res, "Expected a result to be received from the read request");
        assert.deepEqual(res.body, mockMembershipList[0], "Expected membership with the given membership id to be returned");
        sinon.assert.calledWith(mockTopicRequest, 'read', membershipIdSuc);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an empty object upon reading a non-existing membership', function(done) {
    request
      .get('/api/wfm/membership/' + membershipIdNA)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.ok(res, "Expected a result to be received from the read request");
        assert.deepEqual(res.body, {}, "Expected an empty object upon reading a membership that does not exist");
        sinon.assert.calledWith(mockTopicRequest, 'read', membershipIdNA);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error if an error occurred when attempting to read a membership', function(done) {
    mockErr = {error: "An error occurred during membership read"};

    request
      .get('/api/wfm/membership/' + membershipIdErr)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received when an error occurs during the read request");
        assert.deepEqual(res.body, mockErr, "Expected no results to be received");
        sinon.assert.calledWith(mockTopicRequest, 'read', membershipIdErr);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Update
  it('should return the membership that was updated', function(done) {
    req = {id: membershipIdSuc, group: 'test-group-1', user: 'test-user-updated'};

    request
      .put('/api/wfm/membership/' + membershipIdSuc)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.deepEqual(res.body, req, "Expected the updated membership to be received");
        sinon.assert.calledWith(mockTopicRequest, 'update', req, {uid: membershipIdSuc});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error upon the attempt of updating a non-existing membership', function(done) {
    req = {id: membershipIdNA, group: 'test-group-NA', user: 'test-userNA'};
    mockErr = {error: "Membership to be updated does not exist"};

    request
      .put('/api/wfm/membership/' + membershipIdNA)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'update', req, {uid: membershipIdNA});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error if an error occurred when attempting to update a membership', function(done) {
    req = {id: membershipIdErr, group: 'test-group-ERR', user: 'test-user-ERR'};
    mockErr = {error: "An error occurred during membership update"};

    request
      .put('/api/wfm/membership/' + membershipIdErr)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'update', req, {uid: membershipIdErr});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Create
  it('should return the membership that was created', function(done) {
    req = {id: 'membership-test-generated-id', group: 'test-group-1', user: 'new-test-user'};

    request
      .post('/api/wfm/membership/')
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.deepEqual(res.body, req, "Expected the created membership to be received");
        sinon.assert.calledWith(mockTopicRequest, 'create', sinon.match.object, sinon.match.object);
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  //Delete
  it('should return the membership that has been deleted', function(done) {
    req = {id: membershipIdSuc, group: 'test-group-1', user: 'test-user-1'};

    request
      .delete('/api/wfm/membership/' + membershipIdSuc)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(!res.error, "Expected no response error to be received");
        assert.deepEqual(res.body, req, "Expected the deleted membership object to be received");
        sinon.assert.calledWith(mockTopicRequest, 'delete', req, {uid: membershipIdSuc});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error upon the attempt of deleting a non-existing membership', function(done) {
    req = {id: membershipIdNA, group: 'test-group-NA', user: 'test-userNA'};
    mockErr = {error: "Membership to be deleted does not exist"};

    request
      .delete('/api/wfm/membership/' + membershipIdNA)
      .send(req, res)
      .expect(200, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'delete', req, {uid: membershipIdNA});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });

  it('should return an error if an error occurred when attempting to update a membership', function(done) {
    req = {id: membershipIdErr, group: 'test-group-ERR', user: 'test-user-ERR'};
    mockErr = {error: "An error occurred during membership deletion"};

    request
      .delete('/api/wfm/membership/' + membershipIdErr)
      .send(req, res)
      .expect(500, function(err, res) {
        assert.ok(res.error, "Expected an error to be received");
        assert.deepEqual(res.body, mockErr, "Expected a response error message to be received");
        sinon.assert.calledWith(mockTopicRequest, 'delete', req, {uid: membershipIdErr});
        sinon.assert.calledOnce(mockTopicRequest);
        done();
      });
  });
});