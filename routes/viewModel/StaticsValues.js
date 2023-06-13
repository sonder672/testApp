const CacheViewModel = require('./CacheViewModel');
let UserModelCache = false;

const getContractUserAdmin = async () => {
	try {
		if (!UserModelCache) {
			UserModelCache = await CacheViewModel.getModelCache('UserModel');
		}
		return UserModelCache.findOne({ publicAddress: process.env.ADMIN_WALLET.toLowerCase() }, {
			_id: 1,
			publicAddress: 1,
		}).cache(20, 'ContractAdmin').lean();
		
	} catch (e) {
		console.log('getContractAdmin', e);
	}
};
const getContractMarketPlace = async () => {
	try {
		if (!UserModelCache) {
			UserModelCache = await CacheViewModel.getModelCache('UserModel');
		}
		return UserModelCache.findOne({ publicAddress: process.env.CONTRACT_MARKETPLACE.toLowerCase() }, {
			_id: 1,
			publicAddress: 1,
		}).cache(20, 'ContractMarket').lean();
		
	} catch (e) {
		console.log('getContractMarketPlace', e);
	}
};


exports.getContractUserAdmin = getContractUserAdmin;
exports.getContractMarketPlace = getContractMarketPlace;
