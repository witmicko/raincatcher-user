/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

module.exports = {
  apiHost: 'http://localhost:8080',
  apiPath: '/api/wfm/user',
  authpolicyPath: '/box/srv/1.1/admin/authpolicy',
  policyId: process.env.WFM_AUTH_POLICY_ID || 'wfm'
}
