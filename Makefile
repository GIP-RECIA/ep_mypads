build:
	npm run frontend:build

watch:
	npm run frontend:watch

mockup:
	npm run mockupserver

lint:
	npm run lint

test:
	sed -e "s@import settings from 'ep_etherpad-lite/node/utils/Settings'@var settings = require('./spec/settings.js')@" -i auth.js configuration.js storage.js
	npm run test || (sed -e "s@var settings = require('\./spec/settings\.js')@import settings from 'ep_etherpad-lite/node/utils/Settings'@" -i auth.js configuration.js storage.js; exit 1)
	sed -e "s@var settings = require('\./spec/settings\.js')@import settings from 'ep_etherpad-lite/node/utils/Settings'@" -i auth.js configuration.js storage.js

test-ldap:
	sed -e "s@import settings from 'ep_etherpad-lite/node/utils/Settings'@var settings = require('./spec/settings.js')@" -i auth.js configuration.js storage.js
	npm run test-ldap || (sed -e "s@var settings = require('\./spec/settings\.js')@import settings from 'ep_etherpad-lite/node/utils/Settings'@" -i auth.js configuration.js storage.js; exit 1)
	sed -e "s@var settings = require('\./spec/settings\.js')@import settings from 'ep_etherpad-lite/node/utils/Settings'@" -i auth.js configuration.js storage.js

patch-mithril:
	sed -e 's@\(typeof dataAttr === "object"\) ||@\1) {@' -e 's@($$document\.activeElement === node)) {@//&@' -i node_modules/mithril/mithril.js

patch-for-dev:
	sed "/peerDependencies/,+2d" -i package.json
	sed -e "s@import settings from 'ep_etherpad-lite/node/utils/Settings'@var settings = require('./spec/settings.js')@" -i auth.js configuration.js storage.js

unpatch-for-dev:
	if ! grep "peerDependencies" package.json; then sed -e 's/Apache-2.0",/&\n  "peerDependencies": {\n    "ep_etherpad-lite": ">=2.5.0"\n  },/' -i package.json; fi
	sed -e "s@var settings = require('\./spec/settings\.js')@import settings from 'ep_etherpad-lite/node/utils/Settings'@" -i auth.js configuration.js storage.js

all-test: test test-ldap
