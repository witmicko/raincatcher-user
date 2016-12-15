# FeedHenry RainCatcher user [![Build Status](https://travis-ci.org/feedhenry-raincatcher/raincatcher-user.png)](https://travis-ci.org/feedhenry-raincatcher/raincatcher-user)

A module for FeedHenry RainCatcher that manages users, groups and memberships. It provides :
- Backend services to handle CRUD operations for user, group and membership.
- Frontend directives and services providing CRUD clients for user, group and membership.

## Upgrading to 0.1.0 from 0.0.x
Version 0.1.0 introduces secure authentication along with password hashing, password update (available in portal > edit user)

[Raincatcher-demo-portal](https://github.com/feedhenry-raincatcher/raincatcher-demo-portal) has been updated with reset all passwords functionality

User module has now all the functionality to handle user actions
[Raincatcher-demo-auth changes](https://github.com/feedhenry-raincatcher/raincatcher-demo-auth/pull/23/files#diff-541b95c95bad6099c84077e8f995e22fL16)
[Raincatcher-user changes](https://github.com/feedhenry-raincatcher/raincatcher-user/pull/19/files#diff-2c7d8efd78848f1f8e6d2eb8bc78d4c5R133)

### How to upgrade
Update your mobile, portal, cloud and auth service with 0.1.x version of fh-wfm-user


You will also need to hash your user's passwords using new scheme, and there is three ways to do it:
- reset all users to the same password - portal app > settings > reset passwords
- cli/file provided passwords - you can see the example here [user_hash_example](https://github.com/witmicko/user_hash_example), 
- individually per user - portal > workers > edit


Update your auth service to reflect changes in [raincatcher-demo-auth](https://github.com/feedhenry-raincatcher/raincatcher-demo-auth/pull/23)

## Client-side usage

### Client-side usage (via broswerify)

#### Setup
This module is packaged in a CommonJS format, exporting the name of the Angular namespace.  The module can be included in an angular.js as follows:

```javascript
angular.module('app', [
, require('fh-wfm-user')
...
])
```

#### Integration

##### Angular Services

This module provides 3 injectable CRUDL services :

- `userClient` : to create, read, list, update and delete users.
- `groupClient` : to create, read, list, update and delete groups.
- `membershipClient` : to create, read, list, update and delete groups.

the `userClient` has these extra functions : `auth`, `hasSession`, `clearSession`, `verify` and `getProfile`

Example usage :
```javascript
resolve: {
        worker: function($stateParams, userClient) {
          return userClient.read($stateParams.workerId);
        }
```
For a more complete example around CRUD operations, please check the [demo portal app](https://github.com/feedhenry-raincatcher/raincatcher-demo-portal/blob/master/src/app/worker/worker.js).

For a more complete example around user authentication operations, please check the [this](https://github.com/feedhenry-raincatcher/raincatcher-demo-portal/blob/master/src/app/auth/auth.js).

##### Directives

| Name | Attributes |
| ---- | ----------- |
| worker-list | workers, selectedModel |
| worker | worker, group |
| worker-form | value, group |
| group-list | groups, selectedModel |
| group | group, members |
| group-form | value |

## Usage in an express backend and mbaas service

### Setup express backend end
The server-side component of this RainCatcher module exports a function that takes express and mediator instances as parameters, as in:

```javascript
var express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , mediator = require('fh-wfm-mediator/lib/mediator')
  ;
// Set authServiveGuid
var authServiceGuid = process.env.WFM_AUTH_GUID;

// configure the express app
...

// setup the wfm user router
require('fh-wfm-user/lib/router/cloud')(mediator, app, authServiceGuid);

```

### Setup mbaas service

```javascript
var express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , mediator = require('fh-wfm-mediator/lib/mediator')
  ;
// Set authServiveGuid
var authServiceGuid = process.env.WFM_AUTH_GUID;

// configure the express app
...

// setup the wfm user router
require('fh-wfm-user/lib/router/mbaas')(mediator, app);
```

For a more complete example check [here](https://github.com/feedhenry-raincatcher/raincatcher-demo-auth)

### Environment variables
The `WFM_AUTH_POLICY_ID` env var can be set in the WFM cloud APP to override the default `wfm` auth policy ID.

### Exposed CRUD endpoints

Base url : `/api/wfm/[group|user|membership|`

| resource | method | returns |
| -------- | ------ | ------- |
| / | GET | array of users/groups/memberships |
| /:id | GET | user/group/membership |
| /:id | PUT | updated user/group/membership |
| / | POST | created user/group/membership |
| /:id | DELETE | deleted user/group/membership |

### Exposed Auth endpoints

Base url : `/api/wfm/user`

| resource | parameters | method | returns |
| -------- | ------ | ------- | ---- |
| /auth | all | username, password | `{satus: 'ok', userId: userId, sessionToken: sessiontoken, authResponse: profileData}` |
| /verifysession | all | | `{isValid: true}` |
| /revokesession | all | |  `{}` |



### message data structure example
- user :

```javascript

  {
    "id" : "156340",
    "username" : "trever",
    "name" : "Trever Smith",
    "position" : "Senior Truck Driver",
    "phone" : "(265) 725 8272",
    "email" : "trever@wfm.com",
    "notes" : "Trever doesn't work during the weekends.",
    "avatar" : "https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg",
    "banner" : "http://web18.streamhoster.com/pentonmedia/beefmagazine.com/TreverStockyards_38371.jpg"
  }

```
- group :

```javascript
  {
    id: 1010,
    name: 'Drivers',
    role: 'worker'
  }
```
- membership :

```javascript
  {
    id: 0,
    group: 1010,
    user: 156340
  }
```
