const ethers = require('ethers');

exports.waitFor = async (ms) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
};
exports.NFT_TYPE = [
	'SG',
	'COMBO',	// 1
	'LIQUID',		// 2
];
exports.NFT_STATE = [
	'SELLING',
	'IDLE'
];

exports.NFT_CARDS = [
	'SG 1.0',
	'SG 2.0',
	'SG 3.0',
	'SG 4.0',
	'SG 5.0'
];
exports.NFT_LIQUID = [
	'PROMISE',
	'STAR',
	'LEGEND',
	'MYTH',
	'GOD',
];
// exports.NFT_COMBOS ={
// 	"blue":{
// 		Card: "Blue Card",
// 		Liquid: "Blue Liquid"
// 	},
// 	"red":{
// 		Card: "Red Card",
// 		Liquid: "Red Liquid"
// 	},
// 	"yellow":{
// 		Card: "Yellow Card",
// 		Liquid: "Yellow Liquid"
// 	},
// 	"green":{
// 		Card: "Green Card",
// 		Liquid: "Green Liquid"
// 	},
// }


exports.WEAPON_STATE = [
	'SELLING',
	'IDLE'
];



exports.ORDER_STATES = ['OPEN', 'CANCEL', 'DONE'];

// @todo : check round
exports.roundBigNumber = (n) => {

	return +ethers.utils.formatEther(n);

	// let raw = Number(n);
	// raw /= Number(1e19);
	// return Math.round((raw + 1 / Number(1e19)), 9);
};

// exports.toBigNumberString = (n) => {
// 	return +ethers.utils.parseEther(n)
// 	// return (Number(n) * Number(1e18)).toLocaleString('fullwide', { useGrouping: false });
// };



