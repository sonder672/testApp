// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
const CronJob = require('cron').CronJob;
// Require keystone
var keystone = require('keystone');
var Twig = require('twig');
var _ = require('underscore');


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'CACE DASHBOARD',
	'brand': 'CACE',
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'twig',

	'twig options': { method: 'fs' },
	'custom engine': Twig.render,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	// 'session store': 'mongo',
	'auth': true,
	'logger': 'combined',
	'user model': 'AdminModel',
	'port': process.env.KEYSTONE_PORT || 4010,
});

// Load your project's Models
keystone.import('baseModel');
keystone.import('models');


// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));
//keystone.set('signin logo', '/images/logo.png');
keystone.set('cors allow origin','*');
keystone.set('cors allow methods', 'GET,PUT,POST,DELETE,OPTIONS');
keystone.set('cors allow headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

// Configure the navigation bar in Keystone's Admin UI
if (process.env.IT_IS_BACKEND && process.env.IT_IS_BACKEND === 'true') {
	keystone.set('nav', {
		'Eventos': ['EventModel'],
		'Administradores':['AdminModel']
	});
} else {
	keystone.set('nav', {});
}

keystone.start(() => {
	console.log(keystone.get('env'), new Date().toISOString().substr(11, 8), process.env.IT_IS_BACKEND);
	// First step uncomment this
	if (process.env.IT_IS_BACKEND && process.env.IT_IS_BACKEND === 'true') {
		console.log('Capo App backend is initializing :', new Date().toISOString());
		new Promise(async (resolve) => {
			require('./routes/bscscan/index').initilizeContractSyncronizers();
			resolve(true);
		}).then((r) => {
			console.log('migration complete');
		}).catch((err) => {
			console.log(err);
		});
	} else {
		console.log('Real State init as api server', new Date().toISOString());
	}
});
