const jwt = require('jsonwebtoken');
const fs = require('fs');
//const cert = fs.readFileSync('./cert/vulcano.pem');
const CacheViewModel = require('./CacheViewModel');
const UserViewModel = require('./UserViewModel');
const keystone = require('keystone');
const UserModel = keystone.list('UserModel');
const SessionModel = keystone.list('SessionModel');
const ERRORS = require('./../utility/errors').ERRORS;
const statics = require('./../utility/statics');
const StaticsValues = require('./StaticsValues');
const ethSigUtil = require('@metamask/eth-sig-util');
const sigUtil = require('eth-sig-util');
const uuidv4 = require('uuid').v4;
const crypto = require('crypto');
let SessionCacheModel;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const generateToken = (userId) => {
	try {
		return jwt.sign({
			id: userId,
		}, cert, { expiresIn: '24h' });
	} catch (e) {
		console.log(e);

	}
	return false;
};
const getUserIdFromToken = async (token) => {
	try {
		let data = jwt.verify(token, cert);

		if (data && data.id) {
			return data.id;
		}
	} catch (e) {
		// console.log(e);

	}
	return false;
};
const staticsSignInPrefix = 'Sign in to Pathofalchemist.com ';
const secret = uuidv4();
const checkSignatureInternal = async (MetaMessage, MetaSignature) => {
	try {

		const msgParams = {
			data: MetaMessage,
			signature: MetaSignature,
		};
		let publicAddress = ethSigUtil.recoverPersonalSignature(msgParams);
		let nonce = MetaMessage.replace(staticsSignInPrefix, '');
		let query = {
			nonce: nonce.toString().trim(),
			publicAddress: new RegExp(publicAddress.toString().toLowerCase().trim(), 'i'),
		};
		let userData = await UserModel.model.findOne(query, { _id: 1 });
		if (userData) {
			let token = generateToken(userData._id);
			let now = new Date();
			await saveSession(userData._id, token, new Date(now.setHours(now.getHours() + 6)));
			CacheViewModel.clearCacheKey('UserSession-' + userData._id);
			await UserModel.model.findOneAndUpdate({ _id: userData._id }, {
				$set: {
					nonce: crypto.createHmac('sha256', secret)
							.update(publicAddress + uuidv4())
							.digest('hex'),
				},
			});
			return {
				token: token,
				_id: userData._id,
			};
		} else {
			throw ERRORS.NOT_ALLOWED;
		}
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('checkSignature', e);
		}
	}
};

const generateNonceMessage = async (publicAddress, address) => {
	try {
		const hash = crypto.createHmac('sha256', secret)
				.update(address + uuidv4())
				.digest('hex');
		publicAddress = publicAddress.toLowerCase().trim();
		let found = await UserModel.model.findOne({ publicAddress: publicAddress }, { _id: 1, publicAddress: 1 });
		if (!found) {
			found = await UserViewModel.getUserFromPublicAddress(publicAddress);
		}
		await UserModel.model.findOneAndUpdate({ publicAddress: publicAddress }, {
			$set: {
				nonce: hash,
			},
		}, { upsert: true, new: true });
		// UserViewModel.updateNftUserFomContract(found);
		return { hash: staticsSignInPrefix + hash };
	} catch (e) {
		console.log('checkSignature', e);
	}
};

const getUserFromToken = async (token) => {
	try {
		let userId = await getUserIdFromToken(token);
		if (!userId) {
			return false;
		}
		if (!SessionCacheModel) {
			SessionCacheModel = await CacheViewModel.getModelCache('SessionModel');
		}
		let userSession = await SessionCacheModel.findOne({
			user: userId,
			token: token,
		}, { _id: 1 }).cache(20, 'UserSession-' + userId).lean();
		if (userSession) {
			return { _id: userId };
		} else {
			return false;
		}
	} catch (e) {
		console.log(e);
	}
	return false;
};

const removeOldSession = async () => {
	try {
		await SessionModel.model.remove({ expire: { $lt: new Date() } }).limit(1000);
		return true;
	} catch (e) {
		console.log('removeOldSession', e);
	}
};

const saveSession = async (_id, token, expire) => {
	try {
		let item = SessionModel.model({
			user: _id,
			token: token,
			expire: expire,
		});
		return await item.save();
	} catch (e) {
		console.log('SessionViewModel:login');
		throw e;
	}
};

const loginDebug = async (data) => {
	try {
		let publicAddress = data.userId;
		// let publicAddress = data.publicAddress;
		if (!publicAddress) {
			throw ERRORS.INVALID_PARAMS;
		}
		publicAddress = publicAddress.toLowerCase().trim();
		let user = await UserModel.model.findOne({ publicAddress: publicAddress }, { _id: 1, publicAddress: 1 }).lean();

		if (!user) {
			user = await UserViewModel.getUserFromPublicAddress(publicAddress);
		}
		let token = generateToken(user._id);
		let now = new Date();
		await saveSession(user._id, token, new Date(now.setHours(now.getHours() + 24)));
		CacheViewModel.clearCacheKey('UserSession-' + user._id);
		// UserViewModel.updateNftUserFomContract(user);
		return {
			token: token,
			_id: user._id,
		};

	} catch (e) {
		console.log('SessionViewModel:login');
		throw e;
	}
};

const loginMetamaskDebug = async (data) => {
	try {
		// let _id = data.userId;
		let publicAddress = data.publicAddress;
		if (!publicAddress) {
			throw ERRORS.INVALID_PARAMS;
		}
		publicAddress = publicAddress.toLowerCase().trim();
		let user = await UserModel.model.findOne({ publicAddress: publicAddress }, {
			_id: 1,
			name: 1,
			publicAddress: 1,
		}).lean();
		if (!user) {
			user = await UserViewModel.getUserFromPublicAddress(publicAddress);
		}

		if (!user) {
			return { error: true };
		}
		let token = generateToken(user._id);
		let now = new Date();
		await saveSession(user._id, token, new Date(now.setHours(now.getHours() + 6)));
		CacheViewModel.clearCacheKey('UserSession-' + user._id);
		return {
			token: token,
			_id: user._id,
		};

	} catch (e) {
		console.log('SessionViewModel:login');
		throw e;
	}
};

const UpdateNFTUsersWallets = async () => {
	try {
		const now = new Date();
		const adminUser = await StaticsValues.getContractUserAdmin();
		if(!adminUser)
			return;
		const sessionsList = await SessionModel.model.aggregate([{
			$match: {
				sync: { $ne: true },
				user: { $not: new RegExp(adminUser._id.toString()) },
			},
		}, {
			$group: {
				_id: '$user',
			},
		}]).limit(200).sort('-createdAt');
		for (let i = 0; i < sessionsList.length; i++) {
			try {
				const sessionItem = sessionsList[i];
				const user = await UserModel.model.findOne({ _id: sessionItem._id }, { _id: 1, publicAddress: 1 });
				await UserViewModel.updateNftUserFomContract(user);
				if (new Date().getTime() - now.getTime() > 58000) {
					return false;
				}
				await SessionModel.model.updateMany({ user: user._id, sync: { $ne: true } }, { sync: true });
				await statics.waitFor(100);
				// eslint-disable-next-line no-empty
			} catch (e) {
				console.log('error UpdateNFTUsersWallets', e);
			}
		}
		return true;
	} catch (e) {
		console.log('UpdateNFTUsersWallets', e);
	}
	return false;
};

exports.loginMetamaskDebug = loginMetamaskDebug;
exports.loginDebug = loginDebug;
exports.getUserFromToken = getUserFromToken;
exports.generateNonceMessage = generateNonceMessage;
exports.checkSignatureInternal = checkSignatureInternal;
exports.removeOldSession = removeOldSession;
exports.UpdateNFTUsersWallets = UpdateNFTUsersWallets;
