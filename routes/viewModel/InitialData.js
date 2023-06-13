const keystone = require('keystone');
const faker = require('faker');
const statics = require('./../utility/statics');
const ERRORS = require('./../utility/errors').ERRORS;
// const InventoryModel = keystone.list('InventoryModel');
const UserModel = keystone.list('UserModel');


const onUserInitialData = async (userData) => {
	try {
		if (!userData) {
			throw ERRORS.ITEM_NOT_FOUND;
		}

		let publicAddress = false;
		if (typeof userData === 'string' || userData instanceof String) {
			publicAddress = userData;
		} else if (userData && userData.publicAddress) {
			publicAddress = userData.publicAddress;
		}

		let user = await UserModel.model.findOne({ publicAddress: new RegExp(publicAddress, 'i') }, {
			_id: 1,
			name: 1,
			publicAddress: 1,
		}).lean();
		if (!user) {
			publicAddress = publicAddress.toLowerCase();

			// const hornsPerUser = await ProbabilityViewModel.getProbability('INITIAL_HR_BALANCE_FOR_ACCOUNT') || { value: 5000 };
			user = await UserModel.model.findOneAndUpdate({ publicAddress: publicAddress }, {
				$set: {
					publicAddress: publicAddress, username: publicAddress,
				},
			}, {
				upsert: true,
				new: true,
				projection: { _id: 1 },
			});
			user = await UserModel.model.findOne({ publicAddress: publicAddress }, {
				_id: 1,
				name: 1,
				publicAddress: 1,
			}).lean();
			// await InventoryModel.model.findOneAndUpdate({ user: user._id }, {
			// 	$set: {
			// 		iron: 0,
			// 		lead: 0,
			// 		mercury: 0,
			// 		tin: 0,
			// 		copper: 0,
			// 		silver: 0,
			// 		gold: 0,
			// 	},
			// }, {
			// 	upsert: true,
			// 	new: true,
			// 	projection: { _id: 1 },
			// });
			// await inv.save();
		}
		return user;
	} catch (e) {
		console.log('InitialData::onUserInitialData', e);
		throw e;
	}
};

exports.onUserInitialData = onUserInitialData;
