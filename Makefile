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
	npm run test-ldap || (sed -e "s@var settings = require('\./spec/settings\.js')@import settings from 'ep_etherpad-lite/node/utils/Settings'@" -i auth.js configuration.js storage.js; exit 1)
	sed -e "s@var settings = require('\./spec/settings\.js')@import settings from 'ep_etherpad-lite/node/utils/Settings'@" -i auth.js configuration.js storage.js
