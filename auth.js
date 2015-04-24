/**
*  # Authentification Module
*
*  ## License
*
*  Licensed to the Apache Software Foundation (ASF) under one
*  or more contributor license agreements.  See the NOTICE file
*  distributed with this work for additional information
*  regarding copyright ownership.  The ASF licenses this file
*  to you under the Apache License, Version 2.0 (the
*  "License"); you may not use this file except in compliance
*  with the License.  You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing,
*  software distributed under the License is distributed on an
*  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
*  KIND, either express or implied.  See the License for the
*  specific language governing permissions and limitations
*  under the License.
*
*  ## Description
*
*  This module contains all functions about authentification of MyPads users.
*  It's mainly based upon the excellent *passport* Node library.
*
*  TODO : usage of JWT instead of session-based strategy.
*/

// External dependencies
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;

// Local dependencies
var conf = require('./configuration.js');
var user = require('./model/user.js');

module.exports = (function () {
  'use strict';

  /**
  * ## Authentification functions
  */

  var auth = {};

  /**
  * ## Internal functions
  *
  * These functions are not private like with closures, for testing purposes,
  * but they are expected be used only internally by other MyPads functions.
  */

  auth.fn = {};

  /**
  * ### local
  *
  * `local` is a synchronous function used to set up local strategy.
  */

  auth.fn.local = function (secret) {
    passport.use(new JwtStrategy({ secretOrKey: secret },
      function (jwtPayload, done) {
        console.log(jwtPayload);
        done();
      })
    );
    /*
    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
      user.get(id, done);
    });
    passport.use(new localStrategy({
      usernameField: 'login',
      passwordField: 'password'
    }, function (login, password, callback) {
      var isFS = function (s) { return (ld.isString(s) && !ld.isEmpty(s)); };
      if (!isFS(login)) { throw new TypeError('login must be a string'); }
      if (!isFS(password)) { throw new TypeError('password must be a string'); }
      if (!ld.isFunction(callback)) {
        throw new TypeError('callback must be a function');
      }
      auth.fn.localFn.apply(this, arguments);
    }));
    */
  };


  /**
  * ### localFn
  *
  * `localFn` is the function used by `localStrategy` for verifying if login and
  * password are correct. It takes :
  *
  * - a `login` string
  * - a `password` string
  * - a `callback` function, returning
  *   - *Error* if there is a problem
  *   - *null*, *false* and an object for auth error
  *   - *null* and the *user* object for auth success
  */

  auth.fn.localFn = function (login, password, callback) {
    user.get(login, function (err, u) {
      if (err) { return callback(err); }
      auth.fn.isPasswordValid(u, password, function (err, isValid) {
        if (err) { return callback(err); }
        if (!isValid) {
          callback(new Error('password is not correct'), false);
        } else {
          callback(null, u);
        }
      });
    });
  };

  /**
  * ### isPasswordValid
  *
  * `isPasswordValid` compares the hash of given password and saved salt with
  * the one saved in database.
  * It takes :
  *
  * - the `u` user object
  * - the `password` string
  * - a `callback` function, returning *Error* or *null* and a boolean
  */

  auth.fn.isPasswordValid = function (u, password, callback) {
    user.fn.hashPassword(u.password.salt, password, function (err, res) {
      if (err) { callback(err); }
      if (res.hash === u.password.hash) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  };

  /**
  * ## Public functions
  *
  * ### init
  *
  * `iniŧ` is a synchronous function used to set up authentification. It :
  *
  * - initializes local strategy by default
  * - uses of passport middlwares for express
  * - launch session middleware bundled with express, using secret phrase saved
  *   in database
  */

  auth.init = function () {
    conf.get('sessionSecret', function (err, res) {
      if (err) { throw new Error(err); }
      auth.fn.local(res);
    });
  };

  return auth;

}).call(this);
