/**
* # Pad Model
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
*/

module.exports = (function () {
  'use strict';

  // Dependencies
  var ld = require('lodash');
  var cuid = require('cuid');
  var common = require('./common.js');
  var storage = require('../storage.js');
  var PPREFIX = storage.DBPREFIX.PAD;
  var UPREFIX = storage.DBPREFIX.USER;
  var GPREFIX = storage.DBPREFIX.GROUP;

  /**
  * ## Description
  *
  * The pad module contains business logic for private pads. These belongs to
  * groups and can have their own visibility settings.
  *
  * A pad can be viewed as an object like :
  *
  * var pad = {
  *   _id: 'autoGeneratedUniqueString',
  *   name: 'title',
  *   group: 'idOfTheLinkedGroup',
  *   visibility: 'restricted',
  *   users: ['u1', 'u2'],
  *   password: undefined,
  *   readonly: true
  * };
  */

  var pad = {};

  /**
  * ## Internal functions
  *
  * These functions are tested through public functions and API.
  */

  pad.fn = {};

  /**
  * ### assignProps
  *
  * `assignProps` takes params object and assign defaults if needed.
  * It creates :
  *
  * - a `users` array, empty if `visibility` is not 'restricted', with given
  *   keys otherwise
  * - a `visibility` string, *null* or with *restricted*, *private* or *public*
  * - a `password` string, *null* by default
  * - a `readonly` boolean, *null* by default
  *
  * *null* fields are intented to tell MyPads that group properties should be
  * applied here. `assignProps` returns the pad object.
  */

  pad.fn.assignProps = function (params) {
    var p = params;
    var u = { name: p.name, group: p.group };
    if (p.visibility === 'restricted' && ld.isArray(p.users)) {
      u.users = ld.filter(p.users, ld.isString);
    } else {
      u.users = [];
    }
    var vVal = ['restricted', 'private', 'public'];
    var v = p.visibility;
    u.visibility = (ld.isString(v) && ld.includes(vVal, v)) ? v : null;
    u.password = ld.isString(p.password) ? p.password : null;
    u.readonly = ld.isBoolean(p.readonly) ? p.readonly : null;
    return u;
  };

  /**
  * ### checkSet
  *
  * `checkSet` is an async function that ensures that all given users exist.
  * If true, it calls `fn.set`, else it will return and *Error*. It takes :
  *
  * - a `p` pad object
  * - a `callback` function returning and *Error* or *null* and the `p` object.
  */

  pad.fn.checkSet = function (p, callback) {
    if (ld.size(p.users)) {
      var keys = ld.map(p.users, function (v) { return UPREFIX + v; });
      common.checkMultiExist(keys, function (err, res) {
        if (err) { return callback(err); }
        if (!res) { return callback(new Error('some users not found')); }
        pad.fn.set(p, callback);
      });
    } else {
      pad.fn.set(p, callback);
    }
  };

  /**
  * ### indexGroups
  *
  * `indexGroups` is an asynchronous function which handles secondary indexes
  * for *group.pads* after pad creation, update, removal. It takes :
  *
  * - a `del` boolean to know if we have to delete key from index or add it
  * - the `pad` object
  * - a `callback` function, returning Error or *null* if succeeded
  */

  pad.fn.indexGroups = function (del, pad, callback) {
    var _set = function (g) {
      storage.db.set(GPREFIX + g._id, g, function (err) {
        if (err) { return callback(err); }
        callback(null);
      });
    };
    storage.db.get(GPREFIX + pad.group, function (err, g) {
      if (err) { return callback(err); }
      if (del) {
        ld.pull(g.pads, pad._id);
        _set(g);
      } else {
        if (!ld.includes(g.pads, pad._id)) {
          g.pads.push(pad._id);
          _set(g);
        } else {
          callback(null);
        }
      }
    });
  };

  /**
  * ### set
  *
  * `set` is internal function that sets the pad into the database.
  *
  * It takes, as arguments :
  *
  * - the `p` pad object
  * - the `callback` function returning and *Error* or *null* and the `p`
  *   object.
  */

  pad.fn.set = function (p, callback) {
    storage.db.set(PPREFIX + p._id, p, function (err) {
      if (err) { return callback(err); }
      pad.fn.indexGroups(false, p, function (err) {
        if (err) { return callback(err); }
        callback(null, p);
      });
    });
  };

  /**
  * ## Public functions
  *
  * ### get
  *
  *  This function uses `common.getDel` with `del` to *false* and PPREFIX
  *  fixed. It will takes mandatory key string and callback function. See
  *  `common.getDel` for documentation.
  */

  pad.get = ld.partial(common.getDel, false, PPREFIX);

  /**
  * ### set
  *
  * This function adds a new pad or updates properties of an existing one.
  * It checks the fields, throws error if needed, set defaults options. As
  * arguments, it takes mandatory :
  *
  * - `params` object, with
  *
  *   - a `name` string that can't be empty
  *   - an `group` string, the unique key identifying the linked required group
  *   - `visibility`, `password`, `readonly` the same strings as for
  *   `model.group`, but optional : it will takes the group value if not
  *   defined
  * - `users` array, with ids of users invited to read and/or edit the pad, for
  *   restricted visibility only
  *
  * - `callback` function returning error if error, null otherwise and the
  *   pad object;
  * - a special `edit` boolean, defaults to *false* for reusing the function for
  *   set (edit) an existing pad.
  *
  * TODO: ensure user has the right to link _this_ group (admin)
  */

  pad.set = function (params, callback) {
    common.addSetInit(params, callback, ['name', 'group']);
    var p = pad.fn.assignProps(params);
    if (params._id) {
      p._id = params._id;
      common.checkExistence(PPREFIX + p._id, function (err, res) {
        if (err) { return callback(err); }
        if (!res) { return callback(new Error('pad does not exist')); }
        pad.fn.checkSet(p, callback);
      });
    } else {
      p._id = cuid();
      pad.fn.checkSet(p, callback);
    }
  };

  /**
  * ### del
  *
  *  This function uses `common.getDel` with `del` to *false* and GPREFIX
  *  fixed.  It will takes mandatory key string and callback function. See
  *  `common.getDel` for documentation.
  *
  *  It uses the `callback` function to handle secondary indexes for groups.
  */

  pad.del = function (key, callback) {
    if (!ld.isFunction(callback)) {
      throw new TypeError('callback must be a function');
    }
    common.getDel(true, PPREFIX, key, function (err, p) {
      if (err) { return callback(err); }
      pad.fn.indexGroups(true, p, callback);
    });
  };

  /**
  * ## Helpers functions
  *
  *  TODO
  *  Helper here are public functions created to facilitate interaction with
  *  the API and improve performance avoiding extra checking.
  */

  return pad;

}).call(this);
