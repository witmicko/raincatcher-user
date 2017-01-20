var assert = require('assert');
var sinon = require('sinon');
var userClientMock = require('../../test/mocks/user-client-mock');
var sampleUserProfileData = require('../../test/fixtures/sampleUserProfile.json');
var sampleSecurityData = require('../../test/fixtures/sampleSecurityData.json');

describe("Test Storage/Retrieval of Profile Data", function() {

  it('Should return ciphertext when the profile data and the session token are valid', function() {
    var testEncrypt = userClientMock.storeProfile(sampleUserProfileData, sampleSecurityData.sessionToken);
    sinon.assert.calledWith(userClientMock.storeProfile, sampleUserProfileData, sampleSecurityData.sessionToken);
    assert.equal(false, (testEncrypt instanceof Error), 'Should not return an error.');
  });

  it('Should not attempt Encyption when the profileData is null', function() {
    assert.throws( function() {
      userClientMock.storeProfile(null, sampleSecurityData.sessionToken);
    }, Error );
    sinon.assert.calledWith(userClientMock.storeProfile, null, sampleSecurityData.sessionToken);
  });

  it('Should not attempt Encyption when the sessionToken is null', function() {
    assert.throws( function() {
      userClientMock.storeProfile(sampleUserProfileData, null);
    }, Error );
    sinon.assert.calledWith(userClientMock.storeProfile, sampleUserProfileData, null);
  });

  it('Should not attempt Encyption when both the profileData and the sessionToken are null', function() {
    assert.throws( function() {
      userClientMock.storeProfile(null, null);
    }, Error );
    sinon.assert.calledWith(userClientMock.storeProfile, null, null);
  });

});