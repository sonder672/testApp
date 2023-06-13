/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */
var keystone = require('keystone');
var middleware = require('./middleware');
var CustomApi = require('./CustomApi');
var importRoutes = keystone.importer(__dirname);
const MetaAuth = require('meta-auth');
const api = require('keystone/lib/middleware/api');
const metaAuth = new MetaAuth({
	message: 'MetaMessage',
	signature: 'MetaSignature',
	address: 'MetaAddress',
	banner: 'Signin with Metamask on Vulcano',
});
// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views

	// app.get('/', routes.views.index);
	// app.get('/gallery', routes.views.gallery);
	const apiBase = '/api/v1';
	/** ******************************************
	 * STATICS IMAGES
	 ******************************************/
	// app.all(apiBase + '/*', CustomApi);
	// app.get('/images/:imageName', CustomApi, routes.views.nftImages);
	app.use('*', function (req, res, next) {
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Credentials', true);
        next();
    });

    app.options('*', function (req, res) {
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Credentials', true);
        res.sendStatus(200);
    });

	/** ******************************************
	 * USER
	 ******************************************/
	// if (process.env.BLACK_DOOR && process.env.BLACK_DOOR === 'true') {
	// 	app.post(apiBase + '/user/auth/debug', [CustomApi, keystone.middleware.api], routes.api.SessionApi.loginDebug);
	// 	app.post(apiBase + '/user/auth/metamask/debug', [CustomApi, keystone.middleware.api], routes.api.SessionApi.loginMetamaskDebug);
	// }


	// app.get(apiBase + '/user/auth/:MetaAddress', [CustomApi, keystone.middleware.api], routes.api.SessionApi.requestMessage);
	// app.get(apiBase + '/user/auth/:MetaMessage/:MetaSignature', [CustomApi, keystone.middleware.api], routes.api.SessionApi.checkSignature);

	// app.get(apiBase + '/user/mine', [CustomApi, keystone.middleware.api],
			// middleware.requireUser, routes.api.UserApi.getUserInfo);
	// app.post(apiBase + '/user/', [CustomApi, keystone.middleware.api],
			// middleware.requireUser, routes.api.UserApi.setUserInfo);
	// app.post(apiBase + '/user/phone/check', [CustomApi, keystone.middleware.api],
	// 		middleware.requireUser, routes.api.UserApi.checkUserPhoneCode);

	/** ******************************************
	 * ANONIMOUS
	 ******************************************/

	// app.get(apiBase + '/token/images', [CustomApi, keystone.middleware.api], routes.api.TokenApi.getImageFromModelIds);
	// app.get(apiBase + '/token/:nftType/:tokenId', [CustomApi, keystone.middleware.api], routes.api.TokenApi.getTokenById);
	// app.get(apiBase + '/order/:nftType/:tokenId', [CustomApi, keystone.middleware.api], routes.api.TokenApi.getOrderById);
	// app.get(apiBase + '/order/:nftType/:tokenId/history', [keystone.middleware.api, CustomApi], routes.api.OrderApi.getOrdersByNftId);
	// /** ******************************************
	//  * MARKET
	//  ******************************************/

	// app.get(apiBase + '/market/', [CustomApi, keystone.middleware.api], routes.api.MarketApi.getSellingList);
	// app.get(apiBase + '/market/weapon/', [CustomApi, keystone.middleware.api], routes.api.MarketApi.getSellingWeaponList);
	// app.get(apiBase + '/market/land/', [CustomApi, keystone.middleware.api], routes.api.MarketApi.getSellingLandList);
	// app.get(apiBase + '/market/character/', [CustomApi, keystone.middleware.api], routes.api.MarketApi.getSellingCharacterList);

	// app.get(apiBase + '/market/user/:wallet/', [CustomApi, keystone.middleware.api], routes.api.TokenApi.getUserList);
	// // app.get(apiBase + '/market/user/weapon/', [CustomApi, keystone.middleware.api], middleware.requireUser, routes.api.TokenApi.getUserWeaponList);
	// // app.get(apiBase + '/market/user/land/', [CustomApi, keystone.middleware.api], middleware.requireUser, routes.api.TokenApi.getUserLandList);
	// // app.get(apiBase + '/market/user/character/', [CustomApi, keystone.middleware.api], middleware.requireUser, routes.api.TokenApi.getUserCharacterList);

	/** ******************************************
	 * MARKET BOX
	 ******************************************/
	// app.get(apiBase+'/holder/sg',[keystone.middleware.cors,CustomApi],routes.api.HoldersApi.getUserSgNft);
	// app.get(apiBase+'/holder/liquid',[keystone.middleware.cors,CustomApi],routes.api.HoldersApi.getUserLiquidNft);
	
	// // app.get(apiBase + '/market/box/', [CustomApi, keystone.middleware.api], routes.api.MarketApi.getSellingBoxList);
	// // app.get(apiBase + '/market/user/box/', [CustomApi, keystone.middleware.api], middleware.requireUser, routes.api.MarketApi.getUserBoxList);


	// /** ******************************************
	// *  DISPLAY SECTIONS
	// ******************************************/
	// app.get(apiBase+'/display/section/liquid',[keystone.middleware.cors,CustomApi],routes.api.SectionDisplayApi.DisplaySection);
	
	// /** ******************************************
	// *  NFT AND DISCOUNT IN GENERAL
	// ******************************************/
	// app.get(apiBase+'/nft/all',[keystone.middleware.cors,CustomApi],routes.api.NftApi.getAllNft);
	// app.get(apiBase+'/nft/discounts',[keystone.middleware.cors,CustomApi],routes.api.DiscountApi.getDiscounts);
	// app.get(apiBase+'/nft/claim/:user',[keystone.middleware.cors,CustomApi],routes.api.ClaimApi.getClaims);
	//////////////// EVENTS API //////////////////
	app.get(apiBase+'/event/:id',routes.api.EventsApi.getEvent);
	app.get(apiBase+'/events/qr/:eventId',[keystone.middleware.cors,CustomApi],routes.api.EventsApi.getEventQr);
	app.get(apiBase + '/events/actualevent',[keystone.middleware.cors,CustomApi],routes.api.EventsApi.getActualEvent)
	app.get(apiBase + '/events/user/data',[keystone.middleware.cors,CustomApi],routes.api.NftApi.getPhotoUrl)
	app.post(apiBase + '/events/user/exists',[keystone.middleware.cors,CustomApi],routes.api.EventsApi.isInEvent)
	
	app.post(apiBase + '/events/register/user',[keystone.middleware.cors,CustomApi],routes.api.EventsApi.assignUsertoEvent)
	////////////////////////////////////// USER API ///////////////////////////
	app.post(apiBase+'/user/exist',[keystone.middleware.cors],routes.api.UserApi.existUser);
	app.post(apiBase+ '/user/create',[keystone.middleware.cors,CustomApi],routes.api.UserApi.registerUser);
	app.post(apiBase + '/user/wallet/assign',[keystone.middleware.cors,CustomApi],routes.api.UserApi.walletAssign)
	app.get(apiBase + '/user/wallet/exists',[keystone.middleware.cors,CustomApi],routes.api.UserApi.walletExists)
	///////////////////////////// NFTS ////////////////
	app.post(apiBase + '/nft/new',[keystone.middleware.cors,CustomApi],routes.api.NftApi.uploadNft);
	app.post(apiBase + '/nft/photo',[keystone.middleware.cors,CustomApi],routes.api.NftApi.getImage)
	app.post(apiBase + '/nft/user',[keystone.middleware.cors,CustomApi],routes.api.NftApi.getAllUserNft)
	app.get(apiBase + '/nft/photo/:id',[keystone.middleware.cors,CustomApi],routes.api.NftApi.getPhotoUrlById)
	///////////////////////////// CERTIFICATES ////////////////////////
	app.get(apiBase + '/certificate/user/:email',[keystone.middleware.cors,CustomApi],routes.api.NftApi.getUserCertificates);
	app.get(apiBase + '/certificate/user',[keystone.middleware.cors,CustomApi],routes.api.NftApi.getCertificateUrlById);
	// app.post(apiBase + '/certificate/user/mint',[keystone.middleware.cors,CustomApi],routes.api.NftApi.mintCertificate);
	app.get(apiBase + '/certificate/download/:filename',[keystone.middleware.cors,CustomApi],routes.api.NftApi.downloadCertificate);

};
