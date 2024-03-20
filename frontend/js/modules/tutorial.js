/**
*  vim:set sw=2 ts=2 sts=2 ft=javascript expandtab:
*
*  # User module
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
*  This module contains common functions for `login`, `subscribe` and `profile`
*  modules.
*/

module.exports = (function () {
        // Global dependencie
    var m  = require('mithril');

        // Local dependencies
    var conf = require('../configuration.js');
    var layout = require('./layout.js');

    var tutorial = {};

    /**
    * ## Views
    */

    var view = {};

    view.group = function () {
        return m('div', [
            m('p', conf.LANG.GROUP.HELP),
            m('p', conf.LANG.GROUP.SORT.HELP),
            m.trust(conf.LANG.GROUP.VIEW_HELP),
            m.trust(conf.LANG.GROUP.ADD_HELP),
            m.trust(conf.LANG.GROUP.ADD_HELP_LABEL)
        ]);
    };

    view.inviteUser = function () {
        return m.trust(conf.LANG.GROUP.INVITE_USER.HELP);
    };

    view.pad = function () {
        return m('div', [
            m.trust(conf.LANG.GROUP.PAD.VIEW_HELP),
            m('p', conf.LANG.GROUP.INFO.GROUP_PARAMS)
        ]);
    };

    view.user = function () {
        return m('div', [
            m.trust(conf.LANG.USER.HELP.PROFILE)
        ]);
    };

    view.main = function () {
        return m('section', [
            m('h2', conf.LANG.ACTIONS.HELP),
            m('section.panel.panel-primary', [
                m('.panel-heading',
                    m('h3.panel-title', conf.LANG.GROUP.GROUPS)
                ),
                m('.panel-body', [
                    view.group(),
                ]),
            ]),
            m('section.panel.panel-info', [
                m('.panel-heading',
                    m('h3.panel-title', conf.LANG.GROUP.PAD.PADS)
                ),
                m('.panel-body', [
                    view.pad()
                ])
            ]),
            m('section.panel.panel-success', [
                m('.panel-heading',
                    m('h3.panel-title', conf.LANG.MENU.PROFILE)
                ),
                m('.panel-body', [
                    view.user()
                ])
            ]),
            m('section.panel.panel-warning', [
                m('.panel-heading',
                    m('h3.panel-title', conf.LANG.USERLIST.USERLIST)
                ),
                m('.panel-body', [
                    view.inviteUser()
                ])
            ])
        ]);
    };
   
    tutorial.view = function () {
        return layout.view(view.main());
    };

    return tutorial;

}).call(this);