/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = function(mediator, app, guid) {
  require('../user/user-router')(app, guid);
  require('../group/group-router')(mediator, app);
  require('../membership/membership-router')(mediator, app);
};
