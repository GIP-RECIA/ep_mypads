/**
*  vim:set sw=2 ts=2 sts=2 ft=javascript expandtab:
*
*  # Frontend Entry Point
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
*  This module is the entry point for front JavaScript programming. It requires
*  global dependencies and main client-side file.
*/

(function () {
  var conf  = require('./frontend/js/configuration.js');
  var route = require('./frontend/js/route.js');
  conf.init(route.init);
}).call(this);

document.addEventListener("DOMContentLoaded", function(event) {
  const portalDomains = {
    'pads.netocentre.fr': 'lycees.netocentre.fr',
    'pads.recia.fr': 'ent.recia.fr',
    'pads-agri.netocentre.fr': 'lycees.netocentre.fr',
    'pads.touraine-eschool.fr': 'www.touraine-eschool.fr',
    'pads.chercan.fr': 'www.chercan.fr',
    'pads.colleges41.fr': 'ent.colleges41.fr',
    'pads.e-college.indre.fr': 'e-college.indre.fr',
    'pads.mon-e-college.loiret.fr': 'mon-e-college.loiret.fr',
    'pads.colleges-eureliens.fr': 'www.colleges-eureliens.fr',
    'pads.entkapreunion.re': 'lycees.entkapreunion.re',
    'pads.lycees.test.recia.dev': 'lycees.test.recia.dev',
    'pads.clg18.test.recia.dev': 'clg18.test.recia.dev',
    'pads.clg28.test.recia.dev': 'clg28.test.recia.dev',
    'pads.clg36.test.recia.dev': 'clg36.test.recia.dev',
    'pads.clg37.test.recia.dev': 'clg37.test.recia.dev',
    'pads.clg41.test.recia.dev': 'clg41.test.recia.dev',
    'pads.clg45.test.recia.dev': 'clg45.test.recia.dev',
    'pads.cfa': 'cfa.test.recia.dev',
    'pads.ef2s': 'ef2s.test.recia.dev',
    'pads.recia.test.recia.dev': 'recia.test.recia.dev',
    'pads.lycees.test.entkapreunion.dev': 'lycees.test.entkapreunion.dev',
  };
  const domain = portalDomains[window.location.hostname];

  if (domain !== undefined) {
    const header = document.querySelector('r-header');
    header.setAttribute('domain', domain);
  
    const footer = document.querySelector('r-footer');
    footer.setAttribute('domain', domain);
  
    const pageLayout = document.querySelector('r-page-layout');
    pageLayout.setAttribute('back-link', JSON.stringify({
      name: 'Retour à l\'accueil',
      href: `https://${domain}/portail`,
      target: '_self',
      rel: 'noopener noreferrer'
    }))
  }
});
