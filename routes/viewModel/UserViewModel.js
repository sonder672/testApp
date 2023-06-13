const keystone = require('keystone');
const ERRORS = require('./../utility/errors').ERRORS;
const InitialData = require('./InitialData');
const bscscan = require('./../bscscan/index');
// const SMSVerification = require('./SMSVerification');
const statics = require('./../utility/statics');
const UserModel = keystone.list('UserModel');
const WalletModel = keystone.list('WalletModel');
const getUserInfo = async (email) => {
	try {
		return await UserModel.model.findOne({email: email.toLowerCase() },
				{ __v: 0, createdAt: 0, updatedBy: 0 }).lean();
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserViewModel::getUserInfo', e);
		}
		throw e;
	}
};

const getUserFromPublicAddress = async (publicAddress) => {
	try {
		publicAddress = publicAddress.toLowerCase().trim();
		let user = await UserModel.model.findOne({ publicAddress: publicAddress }, {
			_id: 1,
			name: 1,
			publicAddress: 1,
		}).lean();
		if (!user) {
			user = await InitialData.onUserInitialData({ publicAddress: publicAddress });
		}
		return user;
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserViewModel::getUserFromPublicAddress', e);
		}
		throw e;
	}
};

const syncNewTokenData = async (nftId) => {
	try {
		// const tokenData = await bscscan.tokenMeta(nftId);
		// const userPublicAddress = await bscscan.ownerOf(nftId);
		// if (tokenData && userPublicAddress) {
		// 	await OnUserTokenChangeFromBSC(userPublicAddress, tokenData);
		// }
		return true;
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserViewModel::syncNewTokenData', e);
		}
		throw e;
	}
};

const setUserInfo = async (currentUser, data) => {
	try {
		if (!data.phone) {
			return {
				error: 'invalid_phone',
			};
		}
		if (!data.username) {
			return {
				error: 'invalid_username',
			};
		}
		if (!data.email) {
			return {
				error: 'invalid_email',
			};
		}
		const setQuery = { _req_user: currentUser._id };
		const userData = await UserModel.model.findOne({ _id: currentUser._id }, { active: 1, phone: 1 }).lean();
		if (data.username) {
			data.username = data.username.trim(); //.toLowerCase().replace(/[^0-9]+/g, '');

			if (!statics.isValidUserName(data.username)) {
				return {
					error: 'invalid_username',
				};
			}
			const userWith = await UserModel.model.findOne({
				username: data.username,
				_id: { $ne: currentUser._id.toString() },
			}, { _id: 1 }).lean();
			if (userWith) {
				return {
					error: 'duplicate_username',
				};
			}
			setQuery.username = data.username;
		}
		if (data.name) {
			setQuery.name = data.name.trim();
		}
		if (data.email) {
			data.email = data.email.trim().toLowerCase();
			if (!statics.isEmailValid(data.email)) {
				return {
					error: 'invalid_email',
				};
			}
			const userWith = await UserModel.model.findOne({
				email: data.email,
				_id: { $ne: currentUser._id.toString() },
			}, { _id: 1 }).lean();
			if (userWith) {
				return {
					error: 'duplicate_email',
				};
			}
			setQuery.email = data.email;
		}

		if (data.phone) {
			data.phone = data.phone.trim();
			if (data.phone.length < 8) {
				return {
					error: 'invalid_phone',
				};
			}
			if (userData.phone !== data.phone || !userData.active) {
				data.phone = data.phone.trim().toLowerCase();

				const userWith = await UserModel.model.findOne({
					phone: data.phone,
					_id: { $ne: currentUser._id.toString() },
				}, { _id: 1 }).lean();
				if (userWith) {
					return {
						error: 'duplicate_phone',
					};
				}
				// setQuery.phoneCode = Math.floor(1000 + Math.random() * 9000);
				setQuery.phoneCode = '0000';
				setQuery.active = false;
				// SMSVerification.sendSms(setQuery.phoneCode, data.phone);
				setQuery.phone = data.phone;
			}
		}

		const result = {
			user: await UserModel.model.findOneAndUpdate({ _id: currentUser._id }, {
				$set: setQuery,
			}, {
				new: true,
				projection: { __v: 0, createdAt: 0, updatedBy: 0, phoneCode: 0 },
			}).lean(),
		};
		if (setQuery.phoneCode || !userData.active) {
			result.state = 'VERIFY';
		} else {
			result.state = 'OK';
		}
		return result;
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserViewModel::setUserInfo', e);
		}
		throw e;
	}
};


const checkUserPhoneCode = async (currentUser, phoneCode) => {
	try {
		const userInfo = await UserModel.model.findOne({ _id: currentUser._id }, { phoneCode: 1 });
		phoneCode = phoneCode.trim();
		if (phoneCode === userInfo.phoneCode) {
			return {
				user: await UserModel.model.findOneAndUpdate({ _id: currentUser._id }, {
					$set: {
						phoneCode: '',
						active: true,
					},
				}, {
					new: true,
					projection: { __v: 0, createdAt: 0, updatedBy: 0, phoneCode: 0 },
				}).lean(),
				state: 'OK',
			};
		} else {
			return {
				error: 'wrong',
			};
		}
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserViewModel::setUserInfo', e);
		}
		throw e;
	}
};


const updateNftUserFomContract = async (currentUser) => {
	try {

	} catch (e) {

	}
};

const registerUser = async (data)=>{
	try {
		const user = UserModel.model(data);
		return await user.save();
	} catch (error) {
		throw error;
	}
}

const existsWallet = async (wallet,email)=>{
	try {
		const user = await getUserInfo(email.toLowerCase())
		if(!user)
			throw ERRORS.INVALID_PARAMS;
		const data = await WalletModel.model.findOne({$or:[{wallet:wallet.toLowerCase()},{user:user}]}).populate('user').lean()
		return {exists:!!(data?._id),owner:data?.user?.email == user?.email && data?.wallet == wallet};
	} catch (error) {
		throw error;
	}
}
const walletAssign = async (wallet,email)=>{
	try {
		const user = await getUserInfo(email.toLowerCase())
		if(!user)
			throw ERRORS.INVALID_PARAMS;
		const data = await WalletModel.model.create({user:user,wallet:wallet})
		return data;
	} catch (error) {
		throw error;
	}
}


exports.getUserFromPublicAddress = getUserFromPublicAddress;
exports.getUserInfo = getUserInfo;
exports.updateNftUserFomContract = updateNftUserFomContract;
exports.setUserInfo = setUserInfo;
exports.checkUserPhoneCode = checkUserPhoneCode;
exports.registerUser = registerUser;
exports.existsWallet = existsWallet;
exports.walletAssign = walletAssign;