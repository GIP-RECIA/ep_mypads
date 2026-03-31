module.exports = (function() {
  'use strict';

  let settings;
  if (process.env.TEST_LDAP) {
    settings = {
      'users': {
        'admin': {
          'password': 'admin',
          'is_admin': true
        },
        'parker': {
          'password': 'lovesKubiak',
          'is_admin': false
        }
      },
      'ep_mypads': {
        'ldap': {
          'url': 'ldap://rroemhild-test-openldap:10389',
          'bindDN': 'cn=admin,dc=planetexpress,dc=com',
          'bindCredentials': 'GoodNewsEveryone',
          'searchBase': 'ou=people,dc=planetexpress,dc=com',
          'searchFilter': '(uid={{username}})',
          'properties': {
            'login': 'uid',
            'email': 'mail',
            'firstname': 'givenName',
            'lastname': 'sn'
          },
          'defaultLang': 'fr'
        }
      }
    };
  } else {
    // Testing case : we need to mock the express dependency
    settings = {
      users: {
        admin: { password: 'admin', is_admin: true },
        grace: { password: 'admin', is_admin: true },
        parker: { password: 'lovesKubiak', is_admin: false }
      }
    };
  }

  return settings;
}).call(this);
