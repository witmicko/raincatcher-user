var sinon = require('sinon');
require('sinon-as-promised');

/**
 * This function builds a sinon stub to define the request() behaviour of fh-wfm-mediator's topic.request
 * to be used by the membership router
 * @returns {stub}
 */
function getRequestStub() {
  var requestStub = sinon.stub();
  var mockMembershipList = [
    {id: "membership-test-id-1", group: 'test-group-1', user: 'test-user-1'},
    {id: "membership-test-id-2", group: 'test-group-2', user: 'test-user-2'},
    {id: "membership-test-id-3", group: 'test-group-3', user: 'test-user-3'}
  ];
  var mockUpdatedMembership = {id: "membership-test-id-1", group: 'test-group-1', user: 'test-user-updated'};
  var mockCreatedMembership = {id: 'membership-test-generated-id', group: 'test-group-1', user: 'new-test-user'};

  var mockIdSuc = 'membership-test-id-1';
  var mockIdNA = 'membership-test-id-NA';
  var mockIdErr = 'membership-test-id-ERR';

  //List
  requestStub.withArgs('list').resolves(mockMembershipList);

  //Read
  requestStub.withArgs('read', mockIdSuc).resolves(mockMembershipList[0]);
  requestStub.withArgs('read', mockIdNA).resolves({});
  requestStub.withArgs('read', mockIdErr).rejects(new Error("An error occurred during membership read"));

  //Update
  requestStub.withArgs('update', sinon.match.object, sinon.match({uid: mockIdSuc})).resolves(mockUpdatedMembership);
  requestStub.withArgs('update', sinon.match.object, sinon.match({uid: mockIdNA})).rejects(new Error("Membership to be updated does not exist"));
  requestStub.withArgs('update', sinon.match.object, sinon.match({uid: mockIdErr})).rejects(new Error("An error occurred during membership update"));

  //Create
  requestStub.withArgs('create', sinon.match.object, sinon.match.object).resolves(mockCreatedMembership);

  //Delete
  requestStub.withArgs('delete', sinon.match.object, sinon.match({uid: mockIdSuc})).resolves(mockMembershipList[0]);
  requestStub.withArgs('delete', sinon.match.object, sinon.match({uid: mockIdNA})).rejects(new Error("Membership to be deleted does not exist"));
  requestStub.withArgs('delete', sinon.match.object, sinon.match({uid: mockIdErr})).rejects(new Error("An error occurred during membership deletion"));

  requestStub.throws("Invalid Arguments");

  return requestStub;
}

module.exports = {
  request: getRequestStub()
};