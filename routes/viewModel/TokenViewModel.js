const keystone = require('keystone');
const ImagePathUtils = require('./ImagePathUtils');
const moment = require('moment');
const NFTBase = keystone.list('NFTBase');
const OrderModel = keystone.list('OrderModel');
//const UserWeaponModel = keystone.list('UserWeaponModel');
//const UserLandModel = keystone.list('UserLandModel');
//const UserCharacterModel = keystone.list('UserCharacterModel');

const CommonViewModel = require('./../viewModel/CommonViewModel');

const ERRORS = require('./../utility/errors').ERRORS;

const NFTProjection = {
	__v: 0,
	__t: 0,
	blockNumber: 0,
};

// const getImageFromModelIds = async (data) => {
// 	try {
// 		/*
// 		{
// crisol: [1,2,3],
// becas: [1,2],
// piedras: [10,11]
// }
// 		*/
// 		const crisol = [];
// 		if (data.crisol) {
// 			data.crisol = JSON.parse(data.crisol);
// 			if (!Array.isArray(data.crisol)) {
// 				data.crisol = [data.crisol];
// 			}
// 			for (let i = 0; i < data.crisol.length; i++) {
// 				const modelId = data.crisol[i];
// 				if (!isNaN(modelId)) {
// 					const imagePath = ImagePathUtils.imagePathCrisol(modelId);
// 					crisol.push({ modelId: modelId, image: imagePath });
// 				}
// 			}
// 		}

// 		const becas = [];
// 		if (data.becas) {
// 			data.becas = JSON.parse(data.becas);
// 			if (!Array.isArray(data.becas)) {
// 				data.becas = [data.becas];
// 			}
// 			for (let i = 0; i < data.becas.length; i++) {
// 				const modelId = data.becas[i];
// 				if (!isNaN(modelId)) {
// 					const imagePath = ImagePathUtils.imagePathBeca(modelId);
// 					becas.push({ modelId: modelId, image: imagePath });
// 				}
// 			}
// 		}
// 		const piedras = [];
// 		if (data.piedras) {
// 			data.piedras = JSON.parse(data.piedras);
// 			if (!Array.isArray(data.piedras)) {
// 				data.piedras = [data.piedras];
// 			}
// 			for (let i = 0; i < data.piedras.length; i++) {
// 				const modelId = data.piedras[i];
// 				if (!isNaN(modelId)) {
// 					const imagePath = ImagePathUtils.imagePathStone(modelId);
// 					piedras.push({ modelId: modelId, image: imagePath });
// 				}
// 			}
// 		}
// 		return {
// 			crisol,
// 			becas,
// 			piedras,
// 		};
// 	} catch (e) {
// 		if (!e || !e.internalCode) {
// 			console.log('TokenViewModel::getImageFromModelIds', e);
// 		}
// 		throw e;
// 	}
// };

// const getOrderById = async (typeNFT, tokenId) => {
// 	try {
// 		if (!tokenId || !typeNFT) {
// 			throw ERRORS.INVALID_PARAMS;
// 		}
// 		const result = await OrderModel.model.findOne({ tokenId: tokenId, state: 'OPEN', type: typeNFT }, { _id: 1, type: 1, tokenId: 1, orderId: 1, createdAt: 1 });
// 		if (!result) {
// 			throw ERRORS.ITEM_NOT_FOUND;
// 		}
// 		return result;
// 	} catch (e) {
// 		if (!e || !e.internalCode) {
// 			console.log('TokenViewModel::getOrderById', e);
// 		}
// 		throw e;
// 	}
// };

// const getTokenById = async (typeNFT, tokenId) => {
// 	try {
// 		if (!tokenId) {
// 			throw ERRORS.INVALID_PARAMS;
// 		}

// 		const parent = await NFTBase.model.findOne({ tokenId: tokenId }, { _id: 1, type: 1 });
// 		if (!parent || !['SG','LIQUID'].includes(parent.type)) {
// 			throw ERRORS.ITEM_NOT_FOUND;
// 		}
// 		let result = await CommonViewModel.getModelByType(typeNFT).model.findOne({ tokenId: tokenId }, NFTProjection).populate('user', '_id publicAddress').populate('seller', '_id publicAddress').lean();
// 		// result = await CommonViewModel.getModelByType(parent.type).model.findOne({ _id: parent._id }, NFTProjection).populate('user', '_id publicAddress').populate('seller', '_id publicAddress').lean();

// 		if (!result) {
// 			throw ERRORS.ITEM_NOT_FOUND;
// 		}
// 		// result.image = chiva.imageShield;
// 		// result.name = chiva.name;
// 		// result.external_url = process.env.MARKETPLACE + 'token/' + chiva.nftId;
// 		result.attributes = [
// 			{
// 				trait_type: 'rarity',
// 				value: result.rarity.toLowerCase(),
// 			},
// 			{
// 				trait_type: 'type',
// 				value: result.type.toLowerCase(),
// 			}, {
// 				trait_type: 'Date of birth',
// 				value: moment(result.birthTime).format('MMMM Do YYYY'),
// 			}];
// 		return result;
// 	} catch (e) {
// 		if (!e || !e.internalCode) {
// 			console.log('TokenViewModel::getTokenById', e);
// 		}
// 		throw e;
// 	}
// };
// const OP_BY_MODEL_ID = {
// 	op_1: { $or: [{ modelId: { $gte: 1, $lte: 5 } }, { modelId: { $gte: 16, $lte: 20 } }] }, // [1, 2, 3, 4, 5, 16, 17, 18, 19, 20],
// 	op_1_1: { modelId: { $gte: 1, $lte: 5 } },
// 	op_1_2: { modelId: { $gte: 16, $lte: 20 } },
// 	op_2: { $or: [{ modelId: { $gte: 6, $lte: 10 } }, { modelId: { $gte: 21, $lte: 25 } }] }, // [6, 7, 8, 9, 10, 21, 22, 23, 24, 25],
// 	op_2_1: { modelId: { $gte: 6, $lte: 10 } },
// 	op_2_2: { modelId: { $gte: 21, $lte: 25 } },
// 	op_3: { $or: [{ modelId: { $gte: 11, $lte: 15 } }, { modelId: { $gte: 26, $lte: 30 } }] }, // [11, 12, 13, 14, 15, 26, 27, 28, 28, 30],
// 	op_3_1: { modelId: { $gte: 11, $lte: 15 } },
// 	op_3_2: { modelId: { $gte: 26, $lte: 30 } },
// 	op_0_1: { modelId: { $gte: 1, $lte: 15 } },
// 	op_0_2: { modelId: { $gte: 16, $lte: 30 } },
// };
// const KEY_FOR_PERCENT = {
// 	key_1: [
// 		'calcination.efficiency',
// 		'calcination.luck',
// 	], key_1_1: [
// 		'calcination.efficiency',
// 	], key_1_2: [
// 		'calcination.luck',
// 	],
// 	key_2: [
// 		'distillation.efficiency',
// 		'distillation.luck',
// 	], key_2_1: [
// 		'distillation.efficiency',
// 	], key_2_2: [
// 		'distillation.luck',
// 	],
// 	key_3: [
// 		'sublimation.efficiency',
// 		'sublimation.luck',
// 	], key_3_1: [
// 		'sublimation.efficiency',
// 	], key_3_2: [
// 		'sublimation.luck',
// 	], key_0_1: [
// 		'calcination.efficiency',
// 		'distillation.efficiency',
// 		'sublimation.efficiency',
// 	], key_0_2: [
// 		'calcination.luck',
// 		'distillation.luck',
// 		'sublimation.luck',
// 	], all: [
// 		'calcination.efficiency',
// 		'distillation.efficiency',
// 		'sublimation.efficiency',
// 		'calcination.luck',
// 		'distillation.luck',
// 		'sublimation.luck',
// 	],
// };
// const getPercentByIndex = (index) => {
// 	index = Number(index);
// 	switch (index) {
// 	case 1:
// 		return { min: 0, max: 20 };
// 	case 2:
// 		return { min: 21, max: 40 };
// 	case 3:
// 		return { min: 41, max: 60 };
// 	case 4:
// 		return { min: 61, max: 80 };
// 	case 5:
// 		return { min: 81, max: 100 };
// 	default:
// 		return { min: 0, max: 100 };
// 	}
// };

const isNumberBetween = (value, min, max) => {
	if (isNaN(value)) {
		return false;
	}
	const temp = Number(value);
	return temp >= min && temp <= max;
};

const getFilterList = async (currentUser, data) => {
	try {
		let skip = data.skip;
		let limit = data.limit;
		let sort = data.sort;
		let type = data.type;
//		let faction = data.faction;
		let state = data.state;
		if (isNaN(skip)) {
			skip = 0;
		} else {
			skip = Number(skip);
		}
		if (isNaN(limit)) {
			limit = 100;
		} else {
			limit = Number(limit);
		}

		limit = Math.max(-1, limit);
		limit = Math.min(500, limit);
		skip = Math.max(-1, skip);
		if (!sort) {
			sort = '-createdAt';
		}
		let FindQuery = {};
		if (currentUser) {
			FindQuery.$and = [];
			FindQuery.$and.push({ $or: [{ user: currentUser._id }, { seller: currentUser._id, state: 'SELLING' }] });
		}
		if (state) {
			if (!FindQuery.$and) {
				FindQuery.$and = [];
			}
			FindQuery.$and.push({ state: `${state}`.toUpperCase() });
		}
		if (type) {
			if (!FindQuery.$and) {
				FindQuery.$and = [];
			}
			FindQuery.$and.push({ type: `${type}`.toUpperCase() });
		}
		// if (faction) {
		// 	if (!FindQuery.$and) {
		// 		FindQuery.$and = [];
		// 	}
		// 	FindQuery.$and.push({ faction: `${faction}` });
		// }
		// if (data.rarity) {
		// 	try {
		// 		data.rarity = JSON.parse(data.rarity);
		// 	}
		// 	catch(e) {
		// 		console.error("==> error parsing data.rarity");
		// 		data.rarity = [data.rarity];
		// 	}
		// 	if (!FindQuery.$and) {
		// 		FindQuery.$and = [];
		// 	}
		// 	if (Array.isArray(data.rarity)) {
		// 		if (data.rarity.length === 1) {
		// 			FindQuery.$and.push({ rarity: `${data.rarity[0]}` });
		// 		} else if (data.rarity.length > 1) {
		// 			let tmpValues = [];
		// 			for (let value of data.rarity) {
		// 				tmpValues.push({
		// 					rarity: value
		// 				});
		// 			}
		// 			FindQuery.$and.push({ $or: tmpValues });
		// 		}
		// 	} else {
		// 		FindQuery.$and.push({ rarity: `${data.rarity}` });
		// 	}

		// }
		if (data.tokenId) {
			FindQuery = { tokenId: data.tokenId };
		}
		console.log('log query', JSON.stringify(FindQuery));

		const promise = NFTBase.model.find(FindQuery, NFTProjection).skip(skip).limit(limit);

		const items = await promise.populate('user', '_id publicAddress').populate('seller', '_id publicAddress').sort(sort).lean().exec();

		const count = await NFTBase.model.count(FindQuery);

		return {
			items: items,
			count: count,
		};

	} catch
		(e) {
		if (!e || !e.internalCode) {
			console.log('TokenViewModel::getTokenById', e);
		}
		throw e;
	}
};

const getFilterWeaponList = async (currentUser, data) => {
	try {
		let skip = data.skip;
		let limit = data.limit;
		let sort = data.sort;
		let state = data.state;
		if (isNaN(skip)) {
			skip = 0;
		} else {
			skip = Number(skip);
		}
		if (isNaN(limit)) {
			limit = 100;
		} else {
			limit = Number(limit);
		}

		limit = Math.max(-1, limit);
		limit = Math.min(500, limit);
		skip = Math.max(-1, skip);
		if (!sort) {
			sort = '-createdAt';
		}
		let FindQuery = {};
		if (currentUser) {
			FindQuery.$and = [];
			FindQuery.$and.push({ $or: [{ user: currentUser._id }, { seller: currentUser._id, state: 'SELLING' }] });
		}
		if (isNumberBetween(data.op, 1, 3)) {
			let opNumber = Number(data.op);
			let opKey = 'op_' + opNumber + '';
			if (isNumberBetween(data.opType, 1, 2)) {
				let opTypeNumber = Number(data.opType);
				opKey = 'op_' + opNumber + '_' + opTypeNumber;
			}
			const values = OP_BY_MODEL_ID[opKey];
			if (values) {
				if (!FindQuery.$and) {
					FindQuery.$and = [];
				}
				FindQuery.$and.push(values);
			}
		} else if (isNumberBetween(data.opType, 1, 2)) {
			let opTypeNumber = Number(data.opType);
			let opKey = 'op_' + 0 + '_' + opTypeNumber;
			const values = OP_BY_MODEL_ID[opKey];
			if (values) {
				if (!FindQuery.$and) {
					FindQuery.$and = [];
				}
				FindQuery.$and.push(values);

			}
		}
		// if (data.percent) {
		// 	data.percent = JSON.parse(data.percent);
		// 	if (!Array.isArray(data.percent)) {
		// 		data.percent = [data.percent];
		// 	}
		// 	let percentKeys = [];
		// 	if (isNumberBetween(data.op, 1, 3)) {
		// 		//key_0_2
		// 		if (isNumberBetween(data.opType, 1, 2)) {
		// 			percentKeys = KEY_FOR_PERCENT['key_' + data.op + '_' + data.opType];
		// 		} else {
		// 			percentKeys = KEY_FOR_PERCENT['key_' + data.op];
		// 		}
		//
		// 	} else if (isNumberBetween(data.opType, 1, 2)) {
		// 		percentKeys = KEY_FOR_PERCENT['key_0_' + data.opType];
		// 	} else {
		// 		percentKeys = KEY_FOR_PERCENT.all;
		// 	}
		// 	if (!FindQuery.$and) {
		// 		FindQuery.$and = [];
		// 	}
		// 	if (percentKeys.length === 1 && data.percent.length === 1) {
		// 		const tempQuery = {};
		// 		if (isNumberBetween(data.percent[0], 1, 5)) {
		// 			const perValues = getPercentByIndex(data.percent[0]);
		// 			tempQuery[percentKeys[0]] = { $gte: perValues.min, $lte: perValues.max };
		// 			FindQuery.$and.push(tempQuery);
		// 		}
		// 	} else {
		// 		const andQuery = [];
		// 		for (let i = 0; i < percentKeys.length; i++) {
		// 			const key = percentKeys[i];
		// 			const internalOr = [];
		// 			for (let j = 0; j < data.percent.length; j++) {
		// 				if (isNumberBetween(data.percent[j], 1, 5)) {
		// 					const perValues = getPercentByIndex(data.percent[j]);
		// 					const tempQuery = {};
		// 					tempQuery[key] = { $gte: perValues.min, $lte: perValues.max };
		// 					internalOr.push(tempQuery);
		// 				}
		// 			}
		// 			if (internalOr.length) {
		// 				andQuery.push({ $or: internalOr });
		// 			}
		// 		}
		// 		if (andQuery.length) {
		// 			FindQuery.$and.push({ $and: andQuery });
		// 		}
		// 	}
		// }
		//
		// if (data.modelId) {
		// 	data.modelId = JSON.parse(data.modelId);
		// 	if (Array.isArray(data.modelId)) {
		// 		const orModelId = [];
		// 		for (let i = 0; i < data.modelId.length; i++) {
		// 			orModelId.push({ modelId: data.modelId[i] });
		// 		}
		// 		if (orModelId.length) {
		// 			FindQuery.$and.push({ $or: orModelId });
		// 		}
		// 	} else {
		// 		FindQuery.$and.push({ modelId: data.modelId });
		// 	}
		// }
		if (state) {
			if (!FindQuery.$and) {
				FindQuery.$and = [];
			}
			FindQuery.$and.push({ state: state });
		}
		if (data.tokenId) {
			FindQuery = { tokenId: data.tokenId };
		}
		console.log('log query', JSON.stringify(FindQuery));

		const promise = UserWeaponModel.model.find(FindQuery, NFTProjection).skip(skip).limit(limit);

		const items = await promise.populate('user', '_id publicAddress').populate('seller', '_id publicAddress').sort(sort).lean().exec();

		const count = await UserWeaponModel.model.count(FindQuery);

		return {
			items: items,
			count: count,
		};

	} catch
			(e) {
		if (!e || !e.internalCode) {
			console.log('TokenViewModel::getTokenById', e);
		}
		throw e;
	}
};

const getFilterLandList = async (currentUser, data) => {
	try {
		let skip = data.skip;
		let limit = data.limit;
		let sort = data.sort;
		let state = data.state;
		if (isNaN(skip)) {
			skip = 0;
		} else {
			skip = Number(skip);
		}
		if (isNaN(limit)) {
			limit = 100;
		} else {
			limit = Number(limit);
		}

		limit = Math.max(-1, limit);
		limit = Math.min(500, limit);
		skip = Math.max(-1, skip);
		if (!sort) {
			sort = '-createdAt';
		}
		let FindQuery = {};
		if (currentUser) {
			FindQuery.$and = [];
			FindQuery.$and.push({ $or: [{ user: currentUser._id }, { seller: currentUser._id, state: 'SELLING' }] });
		}
		if (isNumberBetween(data.op, 1, 3)) {
			let opNumber = Number(data.op);
			let opKey = 'op_' + opNumber + '';
			if (isNumberBetween(data.opType, 1, 2)) {
				let opTypeNumber = Number(data.opType);
				opKey = 'op_' + opNumber + '_' + opTypeNumber;
			}
			const values = OP_BY_MODEL_ID[opKey];
			if (values) {
				if (!FindQuery.$and) {
					FindQuery.$and = [];
				}
				FindQuery.$and.push(values);
			}
		} else if (isNumberBetween(data.opType, 1, 2)) {
			let opTypeNumber = Number(data.opType);
			let opKey = 'op_' + 0 + '_' + opTypeNumber;
			const values = OP_BY_MODEL_ID[opKey];
			if (values) {
				if (!FindQuery.$and) {
					FindQuery.$and = [];
				}
				FindQuery.$and.push(values);

			}
		}
		// if (data.percent) {
		// 	data.percent = JSON.parse(data.percent);
		// 	if (!Array.isArray(data.percent)) {
		// 		data.percent = [data.percent];
		// 	}
		// 	let percentKeys = [];
		// 	if (isNumberBetween(data.op, 1, 3)) {
		// 		//key_0_2
		// 		if (isNumberBetween(data.opType, 1, 2)) {
		// 			percentKeys = KEY_FOR_PERCENT['key_' + data.op + '_' + data.opType];
		// 		} else {
		// 			percentKeys = KEY_FOR_PERCENT['key_' + data.op];
		// 		}
		//
		// 	} else if (isNumberBetween(data.opType, 1, 2)) {
		// 		percentKeys = KEY_FOR_PERCENT['key_0_' + data.opType];
		// 	} else {
		// 		percentKeys = KEY_FOR_PERCENT.all;
		// 	}
		// 	if (!FindQuery.$and) {
		// 		FindQuery.$and = [];
		// 	}
		// 	if (percentKeys.length === 1 && data.percent.length === 1) {
		// 		const tempQuery = {};
		// 		if (isNumberBetween(data.percent[0], 1, 5)) {
		// 			const perValues = getPercentByIndex(data.percent[0]);
		// 			tempQuery[percentKeys[0]] = { $gte: perValues.min, $lte: perValues.max };
		// 			FindQuery.$and.push(tempQuery);
		// 		}
		// 	} else {
		// 		const andQuery = [];
		// 		for (let i = 0; i < percentKeys.length; i++) {
		// 			const key = percentKeys[i];
		// 			const internalOr = [];
		// 			for (let j = 0; j < data.percent.length; j++) {
		// 				if (isNumberBetween(data.percent[j], 1, 5)) {
		// 					const perValues = getPercentByIndex(data.percent[j]);
		// 					const tempQuery = {};
		// 					tempQuery[key] = { $gte: perValues.min, $lte: perValues.max };
		// 					internalOr.push(tempQuery);
		// 				}
		// 			}
		// 			if (internalOr.length) {
		// 				andQuery.push({ $or: internalOr });
		// 			}
		// 		}
		// 		if (andQuery.length) {
		// 			FindQuery.$and.push({ $and: andQuery });
		// 		}
		// 	}
		// }
		//
		// if (data.modelId) {
		// 	data.modelId = JSON.parse(data.modelId);
		// 	if (Array.isArray(data.modelId)) {
		// 		const orModelId = [];
		// 		for (let i = 0; i < data.modelId.length; i++) {
		// 			orModelId.push({ modelId: data.modelId[i] });
		// 		}
		// 		if (orModelId.length) {
		// 			FindQuery.$and.push({ $or: orModelId });
		// 		}
		// 	} else {
		// 		FindQuery.$and.push({ modelId: data.modelId });
		// 	}
		// }
		if (state) {
			if (!FindQuery.$and) {
				FindQuery.$and = [];
			}
			FindQuery.$and.push({ state: state });
		}
		if (data.tokenId) {
			FindQuery = { tokenId: data.tokenId };
		}
		console.log('log query', JSON.stringify(FindQuery));

		const promise = UserLandModel.model.find(FindQuery, NFTProjection).skip(skip).limit(limit);

		const items = await promise.populate('user', '_id publicAddress').populate('seller', '_id publicAddress').sort(sort).lean().exec();

		const count = await UserLandModel.model.count(FindQuery);

		return {
			items: items,
			count: count,
		};

	} catch
		(e) {
		if (!e || !e.internalCode) {
			console.log('TokenViewModel::getTokenById', e);
		}
		throw e;
	}
};

const getFilterCharacterList = async (currentUser, data) => {
	try {
		let skip = data.skip;
		let limit = data.limit;
		let sort = data.sort;
		let state = data.state;
		if (isNaN(skip)) {
			skip = 0;
		} else {
			skip = Number(skip);
		}
		if (isNaN(limit)) {
			limit = 100;
		} else {
			limit = Number(limit);
		}

		limit = Math.max(-1, limit);
		limit = Math.min(500, limit);
		skip = Math.max(-1, skip);
		if (!sort) {
			sort = '-createdAt';
		}
		let FindQuery = {};
		if (currentUser) {
			FindQuery.$and = [];
			FindQuery.$and.push({ $or: [{ user: currentUser._id }, { seller: currentUser._id, state: 'SELLING' }] });
		}
		if (isNumberBetween(data.op, 1, 3)) {
			let opNumber = Number(data.op);
			let opKey = 'op_' + opNumber + '';
			if (isNumberBetween(data.opType, 1, 2)) {
				let opTypeNumber = Number(data.opType);
				opKey = 'op_' + opNumber + '_' + opTypeNumber;
			}
			const values = OP_BY_MODEL_ID[opKey];
			if (values) {
				if (!FindQuery.$and) {
					FindQuery.$and = [];
				}
				FindQuery.$and.push(values);
			}
		} else if (isNumberBetween(data.opType, 1, 2)) {
			let opTypeNumber = Number(data.opType);
			let opKey = 'op_' + 0 + '_' + opTypeNumber;
			const values = OP_BY_MODEL_ID[opKey];
			if (values) {
				if (!FindQuery.$and) {
					FindQuery.$and = [];
				}
				FindQuery.$and.push(values);

			}
		}
		// if (data.percent) {
		// 	data.percent = JSON.parse(data.percent);
		// 	if (!Array.isArray(data.percent)) {
		// 		data.percent = [data.percent];
		// 	}
		// 	let percentKeys = [];
		// 	if (isNumberBetween(data.op, 1, 3)) {
		// 		//key_0_2
		// 		if (isNumberBetween(data.opType, 1, 2)) {
		// 			percentKeys = KEY_FOR_PERCENT['key_' + data.op + '_' + data.opType];
		// 		} else {
		// 			percentKeys = KEY_FOR_PERCENT['key_' + data.op];
		// 		}
		//
		// 	} else if (isNumberBetween(data.opType, 1, 2)) {
		// 		percentKeys = KEY_FOR_PERCENT['key_0_' + data.opType];
		// 	} else {
		// 		percentKeys = KEY_FOR_PERCENT.all;
		// 	}
		// 	if (!FindQuery.$and) {
		// 		FindQuery.$and = [];
		// 	}
		// 	if (percentKeys.length === 1 && data.percent.length === 1) {
		// 		const tempQuery = {};
		// 		if (isNumberBetween(data.percent[0], 1, 5)) {
		// 			const perValues = getPercentByIndex(data.percent[0]);
		// 			tempQuery[percentKeys[0]] = { $gte: perValues.min, $lte: perValues.max };
		// 			FindQuery.$and.push(tempQuery);
		// 		}
		// 	} else {
		// 		const andQuery = [];
		// 		for (let i = 0; i < percentKeys.length; i++) {
		// 			const key = percentKeys[i];
		// 			const internalOr = [];
		// 			for (let j = 0; j < data.percent.length; j++) {
		// 				if (isNumberBetween(data.percent[j], 1, 5)) {
		// 					const perValues = getPercentByIndex(data.percent[j]);
		// 					const tempQuery = {};
		// 					tempQuery[key] = { $gte: perValues.min, $lte: perValues.max };
		// 					internalOr.push(tempQuery);
		// 				}
		// 			}
		// 			if (internalOr.length) {
		// 				andQuery.push({ $or: internalOr });
		// 			}
		// 		}
		// 		if (andQuery.length) {
		// 			FindQuery.$and.push({ $and: andQuery });
		// 		}
		// 	}
		// }
		//
		// if (data.modelId) {
		// 	data.modelId = JSON.parse(data.modelId);
		// 	if (Array.isArray(data.modelId)) {
		// 		const orModelId = [];
		// 		for (let i = 0; i < data.modelId.length; i++) {
		// 			orModelId.push({ modelId: data.modelId[i] });
		// 		}
		// 		if (orModelId.length) {
		// 			FindQuery.$and.push({ $or: orModelId });
		// 		}
		// 	} else {
		// 		FindQuery.$and.push({ modelId: data.modelId });
		// 	}
		// }
		if (state) {
			if (!FindQuery.$and) {
				FindQuery.$and = [];
			}
			FindQuery.$and.push({ state: state });
		}
		if (data.tokenId) {
			FindQuery = { tokenId: data.tokenId };
		}
		console.log('log query', JSON.stringify(FindQuery));

		const promise = UserCharacterModel.model.find(FindQuery, NFTProjection).skip(skip).limit(limit);

		const items = await promise.populate('user', '_id publicAddress').populate('seller', '_id publicAddress').sort(sort).lean().exec();

		const count = await UserCharacterModel.model.count(FindQuery);

		return {
			items: items,
			count: count,
		};

	} catch
		(e) {
		if (!e || !e.internalCode) {
			console.log('TokenViewModel::getTokenById', e);
		}
		throw e;
	}
};



// const getFilterCrisolList = async (currentUser, data) => {
// 	try {
// 		let skip = data.skip;
// 		let limit = data.limit;
// 		let sort = data.sort;
// 		let state = data.state;
// 		if (isNaN(skip)) {
// 			skip = 0;
// 		} else {
// 			skip = Number(skip);
// 		}
// 		if (isNaN(limit)) {
// 			limit = 100;
// 		} else {
// 			limit = Number(limit);
// 		}
//
// 		limit = Math.max(-1, limit);
// 		limit = Math.min(500, limit);
// 		skip = Math.max(-1, skip);
// 		if (!sort) {
// 			sort = '-createdAt';
// 		}
// 		let FindQuery = {};
// 		if (currentUser) {
// 			FindQuery.$and = [];
// 			FindQuery.$and.push({ $or: [{ user: currentUser._id }, { seller: currentUser._id, state: 'SELLING' }] });
// 		}
// 		if (isNumberBetween(data.op, 1, 3)) {
// 			let opNumber = Number(data.op);
// 			let opKey = 'op_' + opNumber + '';
// 			if (isNumberBetween(data.opType, 1, 2)) {
// 				let opTypeNumber = Number(data.opType);
// 				opKey = 'op_' + opNumber + '_' + opTypeNumber;
// 			}
// 			const values = OP_BY_MODEL_ID[opKey];
// 			if (values) {
// 				if (!FindQuery.$and) {
// 					FindQuery.$and = [];
// 				}
// 				FindQuery.$and.push(values);
// 			}
// 		} else if (isNumberBetween(data.opType, 1, 2)) {
// 			let opTypeNumber = Number(data.opType);
// 			let opKey = 'op_' + 0 + '_' + opTypeNumber;
// 			const values = OP_BY_MODEL_ID[opKey];
// 			if (values) {
// 				if (!FindQuery.$and) {
// 					FindQuery.$and = [];
// 				}
// 				FindQuery.$and.push(values);
//
// 			}
// 		}
// 		if (data.percent) {
// 			data.percent = JSON.parse(data.percent);
// 			if (!Array.isArray(data.percent)) {
// 				data.percent = [data.percent];
// 			}
// 			let percentKeys = [];
// 			if (isNumberBetween(data.op, 1, 3)) {
// 				//key_0_2
// 				if (isNumberBetween(data.opType, 1, 2)) {
// 					percentKeys = KEY_FOR_PERCENT['key_' + data.op + '_' + data.opType];
// 				} else {
// 					percentKeys = KEY_FOR_PERCENT['key_' + data.op];
// 				}
//
// 			} else if (isNumberBetween(data.opType, 1, 2)) {
// 				percentKeys = KEY_FOR_PERCENT['key_0_' + data.opType];
// 			} else {
// 				percentKeys = KEY_FOR_PERCENT.all;
// 			}
// 			if (!FindQuery.$and) {
// 				FindQuery.$and = [];
// 			}
// 			if (percentKeys.length === 1 && data.percent.length === 1) {
// 				const tempQuery = {};
// 				if (isNumberBetween(data.percent[0], 1, 5)) {
// 					const perValues = getPercentByIndex(data.percent[0]);
// 					tempQuery[percentKeys[0]] = { $gte: perValues.min, $lte: perValues.max };
// 					FindQuery.$and.push(tempQuery);
// 				}
// 			} else {
// 				const andQuery = [];
// 				for (let i = 0; i < percentKeys.length; i++) {
// 					const key = percentKeys[i];
// 					const internalOr = [];
// 					for (let j = 0; j < data.percent.length; j++) {
// 						if (isNumberBetween(data.percent[j], 1, 5)) {
// 							const perValues = getPercentByIndex(data.percent[j]);
// 							const tempQuery = {};
// 							tempQuery[key] = { $gte: perValues.min, $lte: perValues.max };
// 							internalOr.push(tempQuery);
// 						}
// 					}
// 					if (internalOr.length) {
// 						andQuery.push({ $or: internalOr });
// 					}
// 				}
// 				if (andQuery.length) {
// 					FindQuery.$and.push({ $and: andQuery });
// 				}
// 			}
// 		}
//
// 		if (data.modelId) {
// 			data.modelId = JSON.parse(data.modelId);
// 			if (Array.isArray(data.modelId)) {
// 				const orModelId = [];
// 				for (let i = 0; i < data.modelId.length; i++) {
// 					orModelId.push({ modelId: data.modelId[i] });
// 				}
// 				if (orModelId.length) {
// 					FindQuery.$and.push({ $or: orModelId });
// 				}
// 			} else {
// 				FindQuery.$and.push({ modelId: data.modelId });
// 			}
// 		}
// 		if (state) {
// 			if (!FindQuery.$and) {
// 				FindQuery.$and = [];
// 			}
// 			FindQuery.$and.push({ state: state });
// 		}
// 		if (data.tokenId) {
// 			FindQuery = { tokenId: data.tokenId };
// 		}
// 		console.log('log query', JSON.stringify(FindQuery));
//
// 		const promise = UserCrisolModel.model.find(FindQuery, CrisolProjection).skip(skip).limit(limit);
//
// 		const items = await promise.populate('user', '_id publicAddress').populate('seller', '_id publicAddress').sort(sort).lean().exec();
//
// 		const count = await UserCrisolModel.model.count(FindQuery);
//
// 		return {
// 			items: items,
// 			count: count,
// 		};
//
// 	} catch
// 			(e) {
// 		if (!e || !e.internalCode) {
// 			console.log('TokenViewModel::getTokenById', e);
// 		}
// 		throw e;
// 	}
// };
// const getStoneByPower = (power) => {
// 	if (!power) {
// 		return null;
// 	}
// 	power = power.toLowerCase().trim();
// 	//['plomo',"hierro","mercurio","estano","cobre","plata"
// 	//	'',
// 	// 	'LEAD',
// 	// 	'MERCURY',
// 	// 	'TIN',
// 	// 	'COPPER',
// 	// 	'SILVER',
// 	switch (power) {
// 	case 'plomo':
// 		return 'LEAD';
// 	case 'hierro':
// 		return 'IRON';
// 	case 'mercurio':
// 		return 'MERCURY';
// 	case 'estano':
// 		return 'TIN';
// 	case 'cobre':
// 		return 'COPPER';
// 	case 'plata':
// 		return 'SILVER';
// 	}
// 	return null;
// };

// const getFilterStoneList = async (currentUser, data) => {
// 	try {
// 		let skip = data.skip;
// 		let limit = data.limit;
// 		let sort = data.sort;
// 		let state = data.state;
// 		if (isNaN(skip)) {
// 			skip = 0;
// 		} else {
// 			skip = Number(skip);
// 		}
// 		if (isNaN(limit)) {
// 			limit = 100;
// 		} else {
// 			limit = Number(limit);
// 		}
//
// 		limit = Math.max(-1, limit);
// 		limit = Math.min(500, limit);
// 		skip = Math.max(-1, skip);
// 		if (!sort) {
// 			sort = '-createdAt';
// 		}
// 		let FindQuery = { $and: [] };
// 		if (currentUser) {
// 			FindQuery.$and.push({ $or: [{ user: currentUser._id }, { seller: currentUser._id, state: 'SELLING' }] });
// 		}
// 		if (state) {
// 			FindQuery.$and.push({ state: state });
// 		}
// 		if (data.percent) {
// 			data.percent = JSON.parse(data.percent);
// 			if (!Array.isArray(data.percent)) {
// 				data.percent = [data.percent];
// 			}
// 		}
//
// 		if (data.power) {
// 			data.power = JSON.parse(data.power);
// 			if (!Array.isArray(data.power)) {
// 				const stoneType = getStoneByPower(data.power);
// 				if (stoneType) {
// 					const temp = { stoneType: stoneType };
// 					if (data.percent) {
// 						temp.$or = [];
// 						for (let j = 0; j < data.percent.length; j++) {
// 							const pp = getPercentByIndex(data.percent[j]);
// 							const tempQuery = {};
// 							tempQuery[stoneType.toLowerCase()] = { $gte: pp.min, $lte: pp.max };
// 							temp.$or.push(tempQuery);
// 						}
// 						if (!temp.$or.length) {
// 							delete temp.$or;
// 						}
// 					}
// 					FindQuery.$and.push(temp);
// 				}
// 			} else {
// 				const or = [];
// 				for (let i = 0; i < data.power.length; i++) {
// 					const temp = data.power[i];
// 					const stoneType = getStoneByPower(temp);
// 					if (stoneType) {
// 						const temp = { stoneType: stoneType };
//
// 						if (data.percent) {
// 							temp.$or = [];
// 							for (let j = 0; j < data.percent.length; j++) {
// 								const pp = getPercentByIndex(data.percent[j]);
// 								const tempQuery = {};
// 								tempQuery[stoneType.toLowerCase()] = { $gte: pp.min, $lte: pp.max };
// 								temp.$or.push(tempQuery);
// 							}
// 							if (!temp.$or.length) {
// 								delete temp.$or;
// 							}
// 						}
// 						or.push(temp);
// 					}
// 				}
// 				if (or.length) {
// 					FindQuery.$and.push({ $or: or });
// 				}
// 			}
//
// 		} else if (data.percent) {
//
// 			const percentOr = [];
// 			for (let j = 0; j < data.percent.length; j++) {
// 				const pp = getPercentByIndex(data.percent[j]);
// 				const tempQuery = [];
// 				tempQuery.push({ iron: { $gte: pp.min, $lte: pp.max }, stoneType: 'IRON' });
// 				tempQuery.push({ lead: { $gte: pp.min, $lte: pp.max }, stoneType: 'LEAD' });
// 				tempQuery.push({ mercury: { $gte: pp.min, $lte: pp.max }, stoneType: 'MERCURY' });
// 				tempQuery.push({ tin: { $gte: pp.min, $lte: pp.max }, stoneType: 'TIN' });
// 				tempQuery.push({ copper: { $gte: pp.min, $lte: pp.max }, stoneType: 'COOPER' });
// 				tempQuery.push({ silver: { $gte: pp.min, $lte: pp.max }, stoneType: 'SILVER' });
// 				percentOr.push({ $or: tempQuery });
// 			}
// 			if (percentOr.length) {
// 				FindQuery.$and.push({ $or: percentOr });
// 			}
// 		}
// 		if (data.modelId) {
// 			data.modelId = JSON.parse(data.modelId);
// 			if (Array.isArray(data.modelId)) {
// 				const orModelId = [];
// 				for (let i = 0; i < data.modelId.length; i++) {
// 					orModelId.push({ modelId: data.modelId[i] });
// 				}
// 				if (orModelId.length) {
// 					FindQuery.$and.push({ $or: orModelId });
// 				}
// 			} else {
// 				FindQuery.$and.push({ modelId: data.modelId });
// 			}
// 		}
// 		if (!FindQuery.$and.length) {
// 			delete FindQuery.$and;
// 		}
// 		if (data.tokenId) {
// 			FindQuery = { tokenId: data.tokenId };
// 		}
// 		console.log(JSON.stringify(FindQuery));
// 		const promise = UserStoneModel.model.find(FindQuery, StoneProjection).skip(skip).limit(limit);
//
// 		const items = await promise.populate('user', '_id publicAddress').populate('seller', '_id publicAddress').sort(sort).lean().exec();
//
// 		const count = await UserStoneModel.model.count(FindQuery);
//
// 		return {
// 			items: items,
// 			count: count,
// 		};
//
// 	} catch (e) {
// 		if (!e || !e.internalCode) {
// 			console.log('TokenViewModel::getTokenById', e);
// 		}
// 		throw e;
// 	}
// };
// const getFilterBecaList = async (currentUser, data) => {
// 	try {
// 		let skip = data.skip;
// 		let limit = data.limit;
// 		let sort = data.sort;
// 		let state = data.state;
// 		if (isNaN(skip)) {
// 			skip = 0;
// 		} else {
// 			skip = Number(skip);
// 		}
// 		if (isNaN(limit)) {
// 			limit = 100;
// 		} else {
// 			limit = Number(limit);
// 		}
//
// 		limit = Math.max(-1, limit);
// 		limit = Math.min(500, limit);
// 		skip = Math.max(-1, skip);
// 		if (!sort) {
// 			sort = '-createdAt';
// 		}
// 		let FindQuery = { $and: [] };
// 		if (currentUser) {
// 			FindQuery.$and.push({ $or: [{ user: currentUser._id }, { seller: currentUser._id, state: 'SELLING' }] });
// 		}
//
// 		if (data.modelId) {
// 			data.modelId = JSON.parse(data.modelId);
// 			if (Array.isArray(data.modelId)) {
// 				const orModelId = [];
// 				for (let i = 0; i < data.modelId.length; i++) {
// 					orModelId.push({ modelId: data.modelId[i] });
// 				}
// 				if (orModelId.length) {
// 					FindQuery.$and.push({ $or: orModelId });
// 				}
// 			} else {
// 				FindQuery.$and.push({ modelId: data.modelId });
// 			}
// 		}
// 		if (state) {
// 			FindQuery.$and.push({ state: state });
// 		}
// 		if (!FindQuery.$and.length) {
// 			delete FindQuery.$and;
// 		}
// 		if (data.tokenId) {
// 			FindQuery = { tokenId: data.tokenId };
// 		}
// 		console.log(JSON.stringify(FindQuery));
// 		const promise = UserBecaModel.model.find(FindQuery, BecaProjection).skip(skip).limit(limit);
//
// 		const items = await promise.populate('user', '_id publicAddress').populate('seller', '_id publicAddress').sort(sort).lean().exec();
//
// 		const count = await UserBecaModel.model.count(FindQuery);
//
// 		return {
// 			items: items,
// 			count: count,
// 		};
//
// 	} catch (e) {
// 		if (!e || !e.internalCode) {
// 			console.log('TokenViewModel::getFilterBecaList', e);
// 		}
// 		throw e;
// 	}
// };

// exports.fixMetadatas = async () => {
// 	// try {
// 	// 	const list = await UserCrisolModel.model.find({}, { _id: 1, modelId: 1, tokenId: 1 }).lean();
// 	// 	for (let i = 0; i < list.length; i++) {
// 	// 		const item = list[i];
// 	// 		const SetQuery = ImagePathUtils.crisolMetadata(item.modelId, item.tokenId);
// 	// 		await UserCrisolModel.model.findOneAndUpdate({ _id: item._id }, { $set: SetQuery });
// 	// 	}
// 	// 	console.log('fixed crisol');
// 	// } catch (e) {
// 	// 	console.log('fixCrisol', e);
// 	// }
// 	try {
// 		const list = await UserStoneModel.model.find({}, { _id: 1, modelId: 1, tokenId: 1 }).lean();
// 		for (let i = 0; i < list.length; i++) {
// 			const item = list[i];
// 			const SetQuery = { image: ImagePathUtils.imagePathStone(item.modelId, item.tokenId) };
// 			await UserStoneModel.model.findOneAndUpdate({ _id: item._id }, { $set: SetQuery });
// 		}
//
// 		console.log('fixed stone');
// 	} catch (e) {
// 		console.log('fixStone', e);
// 	}
// };

// exports.getOrderById = getOrderById;
// exports.getTokenById = getTokenById;
exports.getFilterList = getFilterList;
exports.getFilterWeaponList = getFilterWeaponList;
exports.getFilterLandList = getFilterLandList;
exports.getFilterCharacterList = getFilterCharacterList;
// exports.getFilterCrisolList = getFilterCrisolList;
// exports.getFilterStoneList = getFilterStoneList;
// exports.getFilterBecaList = getFilterBecaList;
// exports.getImageFromModelIds = getImageFromModelIds;
