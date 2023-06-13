const keystone = require('keystone');
const Types = keystone.Field.Types;
const statics = require('./../routes/utility/statics');
/**
 * Base NFT
 * ==========
 */
const NFTBase = new keystone.List('NFTBase', {
	track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false },
	nocreate: true,
	nodelete: true,
	hidden:true,
	schema: {
		usePushEach: true,
	},
	label: 'All Base NFTs',

	map: { name: 'description' },
});


NFTBase.add({
	modelId: { type: Types.Number, required: false, default: 0, initial: true },
	typeNFT: { type: Types.Select, options: statics.NFT_TYPE, required: false, default:'SG', initial: true},
	description: { type: Types.Text, required: true, default: 'SG', initial: true},
	//birthTime: { type: Types.Datetime, required: false, noedit: true },
	//sellingAt: { type: Types.Datetime, required: false, noedit: true },
	price: { type: Types.Number, required: false, default: 0, initial: true},
	//seller: { type: Types.Text , initial: true, noedit: true },
	//transactionHash: { type: Types.Text, required: false, default: '', noedit: true },
	//tokenId: { type: Types.Text, required: true, default: '', initial: true, noedit: true },
	// source: { type: Types.Text, required: true, default: '', initial: true, noedit: true },
	//tokenIdNumber: { type: Types.Number, required: false, default: 0, initial: true, noedit: true },
	//state: { type: Types.Select, options: statics.NFT_STATE, default: 'IDLE', noedit: true },
	//faction: { type: Types.Text, required: true, default: '', initial: true, noedit: true },
	//blockNumber: { type: Types.Number, required: false, default: 0, initial: true, noedit: true },
	//type: { type: Types.Select, options: statics.NFT_TYPE, default: 'SG', noedit: true },
	//image: { type: Types.Text, required: false, default: '', initial: true, noedit: true },
	//rarity: { type: Types.Text, required: false, default: '', noedit: true },
	//tier: { type: Types.Number, required: false, default: 0, initial: true, noedit: true },
	//count: { type: Types.Number, required: false, default: 0, initial: true, noedit: true },
	//generation: { type: Types.Number, required: false, default: 0, initial: true, noedit: true },
});


/**
 * Registration
 */
NFTBase.defaultColumns = '_id,modelId, typeNFT, price, description';
NFTBase.register();

exports = module.exports = NFTBase;
