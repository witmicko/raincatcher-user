'use strict';
const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

// setup proxies for module under test
const mongoProviderProxy = {
  init: sinon.stub().callsArg(2)
};
const redisProviderProxy = {
  init: sinon.stub().callsArg(2)
};
const mbaasSessionMiddleware = proxyquire('./mbaas-session-middleware', {
  '../session/mongoProvider': mongoProviderProxy,
  '../session/redisProvider': redisProviderProxy
});

describe('mbaas-session-middleware', function() {
  describe('#addConfigDefaults', function() {
    describe('for redis', function() {
      it('should supply localhost:6379 as a default', function(done) {
        mbaasSessionMiddleware.init({
          store: 'redis'
        }, function() {
          assert(redisProviderProxy.init.calledWithMatch({
            config: {
              host: sinon.match.string,
              port: sinon.match.string
            }
          }));
          return done();
        });
      });
    });
    describe('for mongodb', function() {
      it('should use a localhost url by default', function(done) {
        mbaasSessionMiddleware.init({
          store: 'mongo'
        }, function() {
          assert(mongoProviderProxy.init.calledWithMatch({
            config: { url: sinon.match.string }
          }));
          return done();
        });
      });
    });
  });
});