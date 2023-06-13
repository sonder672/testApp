/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
const SessionViewModel = require('./viewModel/SessionViewModel');
const ERRORS = require('./utility/errors').ERRORS;
/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
 */
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
	];
	res.locals.user = req.user;
	next();
};

/**
	Fetches and clears the flashMessages before a view is rendered
 */
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) {
		return msgs.length;
	}) ? flashMessages : false;
	next();
};

const tryGetUserFromReq = async (req) => {
	try {
		// if (req.user)
		// return req.user
		let token = req.headers.authorization;
		if (!token) {
			token = req.headers.Authorization;
		}
		if (!token) {
			return false;
		}
		token = token.replace(/^Bearer /, '');
		return await SessionViewModel.getUserFromToken(token);
	} catch (e) {
		console.log('Middleware::tryGetUserFromReq');
	}
	return false;
};
/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = async (req, res, next) => {
	req.user = await tryGetUserFromReq(req);
	if (!req.user) {
		res.apiErrorMine(ERRORS.NOT_ALLOWED);
	} else {
		next();
	}
};
