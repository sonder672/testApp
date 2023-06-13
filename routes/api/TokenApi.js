const TokenViewModel = require('./../viewModel/TokenViewModel');
const UserViewModel = require('./../viewModel/UserViewModel');
const ERRORS = require('./../utility/errors').ERRORS;
const ethers = require('ethers');

const getImageFromModelIds = async (req, res) => {
	try {
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await TokenViewModel.getImageFromModelIds(data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('TokenApi:getImageFromModelIds', e);
		}
		return res.apiErrorMine(e);
	}
};

const getTokenById = async (req, res) => {
	try {
		let tokenId = req.params.tokenId;
		let nftType = req.params.nftType.toUpperCase() ?? '';
		if (!['WEAPON','LAND','CHARACTER'].includes(nftType)) {
			throw ERRORS.INVALID_PARAMS;
		}
		const info = await TokenViewModel.getTokenById(nftType, tokenId);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('TokenApi:getTokenById', e);
		}
		return res.apiErrorMine(e);
	}
};

const getOrderById = async (req, res) => {
	try {
		let tokenId = req.params.tokenId;
		let nftType = req.params.nftType.toUpperCase() ?? '';
		if (!['WEAPON','LAND','CHARACTER'].includes(nftType)) {
			throw ERRORS.INVALID_PARAMS;
		}
		const info = await TokenViewModel.getOrderById(nftType, tokenId);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('TokenApi:getOrderById', e);
		}
		return res.apiErrorMine(e);
	}
};

const getUserList = async (req, res) => {
	try {
		const wallet = ethers.utils.getAddress(req.params.wallet?.toLowerCase());
		if (!wallet) {
			throw ERRORS.INVALID_PARAMS;
		}
		const user = await UserViewModel.getUserFromPublicAddress(wallet);
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await TokenViewModel.getFilterList(user, data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('TokenApi:getUserWeaponList', e);
		}
		return res.apiErrorMine(e);
	}
};
const getUserWeaponList = async (req, res) => {
	try {
		if (!req.user) {
			throw ERRORS.NOT_ALLOWED;
		}
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await TokenViewModel.getFilterWeaponList(req.user, data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('TokenApi:getUserWeaponList', e);
		}
		return res.apiErrorMine(e);
	}
};
const getUserLandList = async (req, res) => {
	try {
		if (!req.user) {
			throw ERRORS.NOT_ALLOWED;
		}
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await TokenViewModel.getFilterLandList(req.user, data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('TokenApi:getUserLandList', e);
		}
		return res.apiErrorMine(e);
	}
};
const getUserCharacterList = async (req, res) => {
	try {
		if (!req.user) {
			throw ERRORS.NOT_ALLOWED;
		}
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await TokenViewModel.getFilterCharacterList(req.user, data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('TokenApi:getUserCharacterList', e);
		}
		return res.apiErrorMine(e);
	}
};


exports.getOrderById = getOrderById;
exports.getTokenById = getTokenById;
exports.getUserList = getUserList;
// exports.getUserWeaponList = getUserWeaponList;
// exports.getUserLandList = getUserLandList;
// exports.getUserCharacterList = getUserCharacterList;
exports.getImageFromModelIds = getImageFromModelIds;
