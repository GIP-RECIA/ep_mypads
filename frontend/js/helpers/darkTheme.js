/**
*  vim:set sw=2 ts=2 sts=2 ft=javascript expandtab:
*
*  # darkTheme helpers functions
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
*  This module contains function to check if the user cache is populated
*/

module.exports = (function () {
  // Dependencies
  var cookie = require('js-cookie');
  var conf   = require('../configuration.js');

  var darkTheme = {};

  /*
   * Read the wantDarkTheme cookie and if it says that the user wants to expand iframe
   */
  darkTheme.wantDarkTheme = function() {
    var wantDarkTheme = cookie.get('wantDarkTheme');
    return (typeof wantDarkTheme === 'string' && wantDarkTheme === 'true');
  };

  /*
   * Set the cookie to remember the darkTheme value
   */
  darkTheme.setWantDarkThemeCookie = function(value) {
    cookie.set('wantDarkTheme', value.toString(), { expires: 365, path: conf.URLS.RAWBASE });
  };

  return darkTheme;

}).call(this);
