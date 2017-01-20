var sinon = require('sinon');
var sampleSecurityData = require('../fixtures/sampleSecurityData.json');

/**
* Simple function to mock the logic for profile data encryption without using phantom/jsdom to mock localstorage interactions.
* The tests for the underlying security functionality is found in lib/security
* @param {object} profileData - the users profile data
* @param {string} sessionToken - the users sessionToken
*/
function storeProfile() {
  var stub = sinon.stub();

  // valid data case
  stub.withArgs(
  sinon.match(sinon.match.typeOf("object")),
  sinon.match(sinon.match.string)).returns(sampleSecurityData.sampleUserProfileDataCiphertext);

  // invalid profileData case
  stub.withArgs(
  sinon.match(sinon.match.typeOf("null")),
  sinon.match(sinon.match.string)).throws(Error("Session Token or Profile Data is Null. Setting profile data to null."));

  // invalid sessionToken case
  stub.withArgs(
  sinon.match(sinon.match.object),
  sinon.match(sinon.match.typeOf("null"))).throws(Error("Session Token or Profile Data is Null. Setting profile data to null."));

  // invalid profileData and sessionToken case
  stub.withArgs(
  sinon.match(sinon.match.typeOf("null")),
  sinon.match(sinon.match.typeOf("null"))).throws(Error("Session Token or Profile Data is Null. Setting profile data to null."));

  return stub;
}

module.exports = {
  storeProfile: storeProfile()
};
