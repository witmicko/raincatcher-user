var sinon = require('sinon');
require('sinon-as-promised');

/**
 * This function builds a sinon stub to define the request() behaviour of fh-wfm-mediator's topic.request
 * to be used by the group router
 * @returns {stub}
 */
function getRequestStub() {
  var requestStub = sinon.stub();
  var mockGroupList = [
    {id: "group-test-id-1", name: 'Drivers', role: 'worker'},
    {id: "group-test-id-2", name: 'Back Office', role: 'manager'},
    {id: "group-test-id-3", name: 'Management', role: 'admin'}
  ];
  var mockUpdatedGroup = {id: 'group-test-id-1', name: 'Drivers-UPDATED', role: 'worker'};
  var mockCreatedGroup = {id: 'group-test-generated-id', name: 'New Group', role: 'worker'};

  var mockIdSuc = 'group-test-id-1';
  var mockIdNA = 'group-test-id-NA';
  var mockIdErr = 'group-test-id-ERR';

  //List
  requestStub.withArgs('list').resolves(mockGroupList);

  //Read
  requestStub.withArgs('read', mockIdSuc).resolves(mockGroupList[0]);
  requestStub.withArgs('read', mockIdNA).resolves({});
  requestStub.withArgs('read', mockIdErr).rejects(new Error("An error occurred during group read"));

  //Update
  requestStub.withArgs('update', sinon.match.object, sinon.match({uid: mockIdSuc})).resolves(mockUpdatedGroup);
  requestStub.withArgs('update', sinon.match.object, sinon.match({uid: mockIdNA})).rejects(new Error("Group to be updated does not exist"));
  requestStub.withArgs('update', sinon.match.object, sinon.match({uid: mockIdErr})).rejects(new Error("An error occurred during group update"));

  //Create
  requestStub.withArgs('create', sinon.match.object, sinon.match.object).resolves(mockCreatedGroup);

  //Delete
  requestStub.withArgs('delete', sinon.match.object, sinon.match({uid: mockIdSuc})).resolves(mockGroupList[0]);
  requestStub.withArgs('delete', sinon.match.object, sinon.match({uid: mockIdNA})).rejects(new Error("Group to be deleted does not exist"));
  requestStub.withArgs('delete', sinon.match.object, sinon.match({uid: mockIdErr})).rejects(new Error("An error occurred during group deletion"));

  requestStub.throws("Invalid Arguments");

  return requestStub;
}

module.exports = {
  request: getRequestStub()
};