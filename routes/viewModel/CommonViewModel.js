const BigNumberLib = require("@ethersproject/bignumber");
const keystone = require('keystone');
// const ERRORS = require('./../utility/errors').ERRORS;
// const statics = require('./../utility/statics');

const NftSgModel = keystone.list('NftSgModel');
const NftLiquidModel = keystone.list('NftLiquidModel');


const getModelByType = (typeNFT) => {
	let model;
	switch (typeNFT) {
		case 'SG': {
			model = NftSgModel;
			break;
		}
		case 'COMBO': {
			model = NftComboModel;
		}
		case 'LIQUID': {
			model = NftLiquidModel;
			break;
		}

	}
	return model;
};

const getNftTypeIdByName = (typeNFT) => {
	// let id;
	// switch(typeNFT) {
	// 	case 'SG': {
	// 		id = 1;
	// 		break;
	// 	}
	// 	case 'LIQUID': {
	// 		id = 2;
	// 		break;
	// 	}
	// }
	return typeNFT === 'SG' ? 1 : 2;
};

const getItemSG = (claimer, parameter, value) => {
	const object = {
		user: claimer
	};
	switch (parameter) {
		case 0:
			object.sgType1 = value;
			return object;
		case 1:
			object.sgType2 = value;
			return object;
		case 2:
			object.sgType3 = value;
			return object;
		case 3:
			object.sgType4 = value;
			return object;
		case 4:
			object.sgType5 = value;
			return object;
	}
}

const getItemLiquid = (claimer, parameter, value) => {
	const object = {
		user: claimer
	};
	switch (parameter) {
		case 10:
			object.LiquidType1 = value;
			return object;
		case 11:
			object.LiquidType2 = value;
			return object;
		case 12:
			object.LiquidType3 = value;
			return object;

		case 13:
			object.LiquidType4 = value;
			return object;

		case 14:
			object.LiquidType5 = value;
			return object;
	}
}

const getItem = (type) => {

	if (type >= 0 && type <= 4) {
		return type + 1;
	}
	if (type >= 5 && type <= 9) {
		return type - 4;
	}
	if (type >= 10 && type <= 14) {
		return type - 9;
	}
}

const getSgByCombo = (type)=>{
	switch(type) {
		case 5:
			return 1
		case 6:
			return 2
		case 7:
			return 3
		case 8:
			return 4
		case 9:
			return 5;
	}
}
const getLiquidByCombo = (type)=>{
	switch(type) {
		case 5:
			return 2
		case 6:
			return 3
		case 7:
			return 4
		case 8:
		case 9:
			return 5;
	}
}

const getNftTypeById = (typeNFTId) => {
	//let name;
	switch (typeNFTId) {
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
			return 'SG'
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
			return 'COMBO'
		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
			return 'LIQUID'
	}

};

const normalize = (b, i, l) => {
	const n = b.replace("0b", "").substring(i, l).split("").reverse().join("");
	return +BigInt("0b" + n).toString(10);
};

const extract = (id, i, l) =>
	BigInt(id).toString(2).split("").reverse().join("").substring(i, l);

const decodeNftId = (id) => {
	const data = extract(id, 0, 256);

	return {
		id: normalize(data, 0, 128),
		generation: normalize(data, 128, 160),
		type: normalize(data, 160, 256),
	};
};

const normalizeAsNumber = (value) => {
	return (value instanceof BigNumberLib.BigNumber) ? value.toNumber() : +value;
};

const normalizeAsString = (value) => {
	return (value instanceof BigNumberLib.BigNumber) ? value.toString() : value;
};

const normalizeValues = (values) => {
	return values.map(v => {
		return { value: v instanceof BigNumberLib.BigNumber ? BigNumberLib.BigNumber.from(v).toString() : v };
	});
};

exports.decodeNftId = decodeNftId;
exports.getItem = getItem;
exports.getModelByType = getModelByType;
exports.getNftTypeIdByName = getNftTypeIdByName;
exports.getNftTypeById = getNftTypeById;
exports.normalizeAsNumber = normalizeAsNumber;
exports.normalizeAsString = normalizeAsString;
exports.normalizeValues = normalizeValues;
exports.getItemSG = getItemSG;
exports.getItemLiquid = getItemLiquid;
exports.getLiquidByCombo = getLiquidByCombo;
exports.getSgByCombo = getSgByCombo;

