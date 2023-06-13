const errors = require('./../utility/errors').ERRORS;
const SessionViewModel = require('./../viewModel/SessionViewModel');

const requestMessage = async (req, res) => {
	try {
		let data = await SessionViewModel.generateNonceMessage(req.params.MetaAddress);
		return res.apiResponse(data);
		// if (req.metaAuth && req.metaAuth.challenge) {
		// 	return res.apiResponse({ challenges: req.metaAuth.challenge });
		// }
		
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('SessionApi:requestMessage', e);
		}
		return res.apiErrorMine(e);
	}
};

const checkSignature = async (req, res) => {
	try {
		let MetaSignature = req.params.MetaSignature;
		let MetaMessage = req.params.MetaMessage;
		let data = await SessionViewModel.checkSignatureInternal(MetaMessage, MetaSignature);
		return res.apiResponse(data);

	} catch (e) {
		if (e && !e.internalCode) {
			console.log('SessionApi:requestMessage', e);
		}
		return res.apiErrorMine(e);
	}
};

const loginDebug = async (req, res) => {
	try {
		
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await SessionViewModel.loginDebug(data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('SessionApi:loginDebug', e);
		}
		return res.apiErrorMine(e);
	}
};
const loginMetamaskDebug = async (req, res) => {
	try {
		
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await SessionViewModel.loginMetamaskDebug(data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('SessionApi:loginDebug', e);
		}
		return res.apiErrorMine(e);
	}
};

exports.loginDebug = loginDebug;
exports.loginMetamaskDebug = loginMetamaskDebug;
exports.requestMessage = requestMessage;
exports.checkSignature = checkSignature;
