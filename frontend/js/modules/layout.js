/**
*  vim:set sw=2 ts=2 sts=2 ft=javascript expandtab:
*
*  # Layout
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
*  This module contains the main layout of MyPads application.
*/

module.exports = (function () {
  // Dependencies
  var m         = require('mithril');
  var ld        = require('lodash');
  var conf      = require('../configuration.js');
  var auth      = require('../auth.js');
  var notif     = require('../widgets/notification.js');
  var expandPad = require('../helpers/expandPad.js');
  var darkTheme = require('../helpers/darkTheme.js');

  var layout = {};

  var views = {};

  /**
  * ## Internal views
  *
  * ### menuMain
  *
  * Returns views for auth and unauth.
  */

  views.menuMain = function () {
    var _routes = {
      auth: [
        {
          route: '/mypads',
          icon: 'duplicate',
          txt: conf.LANG.MENU.PAD
        },
        {
          route: '/mybookmarks',
          icon: 'star',
          txt: conf.LANG.MENU.BOOKMARK
        },
        {
          route: '/myuserlists',
          icon: 'user',
          txt: conf.LANG.MENU.USERLIST
        },
        {
          route: '/myprofile',
          icon: 'home',
          txt: conf.LANG.MENU.PROFILE
        },
        // in waiting a better text
        // {
        //   route: '/tutorial',
        //   icon: 'info-sign',
        //   txt: conf.LANG.ACTIONS.HELP
        // },
        {
          route: '/logout',
          icon: 'off',
          txt: conf.LANG.MENU.LOGOUT
        }
      ],
      admin: [
        {
          route: '/admin',
          icon: 'wrench',
          txt: conf.LANG.MENU.CONFIG
        },
        {
          route: '/admin/users',
          icon: 'user',
          txt: conf.LANG.MENU.USERS
        },
        {
          route: '/admin/logout',
          icon: 'off',
          txt: conf.LANG.MENU.LOGOUT
        }
      ],
      unauth: [
        {
          route: '/login',
          icon: 'lock',
          txt: conf.LANG.USER.LOGIN
        },
        {
          route: '/subscribe',
          icon: 'user',
          txt: conf.LANG.USER.SUBSCRIBE
        }
      ]
    };
    if (conf.SERVER.authMethod !== 'internal' || conf.SERVER.openRegistration === false) {
      _routes.unauth = [
        {
          route: '/login',
          icon: 'lock',
          txt: conf.LANG.USER.LOGIN
        }
      ];
    }
    var activeRoute = function (r) {
      var isActive = (m.route().slice(0, r.route.length) === r.route);
      if (m.route().indexOf('/admin') === 0) {
        isActive = (m.route() === r.route);
      }
      return m('li', { class: (isActive ? 'active' : '') }, [
        m('a', { href: r.route, config: m.route }, [
          m('i', { class: 'glyphicon glyphicon-' + r.icon, title: r.txt }),
          m('span', ' '+r.txt)
        ])
      ]);
    };
    if (auth.isAuthenticated()) {
      if (!conf.SERVER.hideHelpBlocks && auth.userInfo().hideHelp) {
        document.getElementsByTagName('body')[0].classList.add('hidehelpblocks');
      }
      return ld.map(_routes.auth, activeRoute);
    } else if (auth.isAdmin()) {
      return ld.map(_routes.admin, activeRoute);
    } else {
      return ld.map(_routes.unauth, activeRoute);
    }
  };
  /*
  * ## Layout View
  *
  * The main function, used by nearly all others, that fixes the layout DOM.
  * It takes optional :
  *
  * - `main` vdom content;
  * - `aside` vdom content.
  */

  var padViewRouteRegex = new RegExp('/mypads/group/[^/]*/pad/view/[^/]*');
  var indexRouteRegex   = new RegExp('/mypads$');

  layout.view = function (main, aside) {
    var header  = 'header';
    var footer  = 'footer.container.ombre';
    var asideC  = 'aside.col-md-3.col-xs-12';
    var mainC   = 'main.container.ombre';
    var section = 'section.col-md-9.col-xs-12';
    var logo = 'img/mypads_logo.jpg';
    // If the user wants to expand pad and if we are on the view pad page
    if (expandPad.wantExpandedPad() && m.route().match(padViewRouteRegex)) {
      header  = header+'.hidden';
      footer  = footer+'.hidden';
      asideC  = asideC+'.hidden';
      mainC   = 'main.container-fluid.ombre';
      section = 'section.col-md-12.col-xs-12';
    }
    if (m.route().match(indexRouteRegex)) {
      section = section+'.groupList';
    }
    const darkIcons = {
      'sun': `<svg class="dark-theme-selector-sun" width="2rem"
                   xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386
                         6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591
                         1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75
                         12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>`,
      'moon': `<svg class="dark-theme-selector-moon" width="2rem"
                    xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                 <path stroke-linecap="round" stroke-linejoin="round"
                       d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385
                          0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753
                          9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753
                          9.753 0 0 0 9.002-5.998Z" />
               </svg>`
    };
    var wantDarkTheme = m.prop(darkTheme.wantDarkTheme());
    if (wantDarkTheme()) {
      document.querySelector('body').classList.add('dark');
    }
    return [
      m(header, [
        m('div.lang.container.form-inline', [
          m('a', {
            class: 'dark-theme-selector',
            title: wantDarkTheme() ? 'Switch to light theme' : 'Switch to dark theme',
            href: '#',
            onclick: (e) => {
              e.preventDefault();
              let bod = document.querySelector('body.dark');
              if (bod !== null) {
                wantDarkTheme(false);
                darkTheme.setWantDarkThemeCookie(false);
                bod.classList.remove('dark');
              } else {
                wantDarkTheme(true);
                darkTheme.setWantDarkThemeCookie(true);
                document.querySelector('body').classList.add('dark');
              }
            }
          }, [
            m.trust(darkIcons.sun),
            m.trust(darkIcons.moon)
          ]),
          m('select.form-control', ld.reduce(conf.SERVER.languages,
            function (memo, val, key) {
              var opts = {
                onclick: conf.updateLang.bind(null, key),
                value: key
              };
              if (key === conf.USERLANG) {
                opts.selected = 'selected';
              }
              memo.push(m('option', opts, val));
              return memo;
            }, [])
          ),
        ]),
        m('div.container.ombre', [
            m('a.link-home[href=/mypads]', [
              m('img', {src:logo, width:'30', height:'30', class:'logo-img'}),
              m('h1', conf.SERVER.title)
            ]),
          m('hr.trait', {role: 'presentation'}),
          m('nav', { class: 'menu-main' }, [
            m('ul.nav.nav-tabs', views.menuMain())
          ])
        ])
      ]),
      m(mainC, [
        m(section, { config: expandPad.autoExpand }, main || ''),
        m(asideC, aside || '')
      ]),
      m('section', { class: 'notification' }, notif.view(notif.controller())),
      m(footer, m('p', [
        m('span', m.trust(conf.LANG.GLOBAL.FOOTER + ' | ')),
        m('a', { href: '/admin', config: m.route }, conf.LANG.MENU.ADMIN)
      ]))
    ];
  };

  return layout;

}).call(this);
