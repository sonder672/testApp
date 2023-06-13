const keystone = require('keystone');
const Types = keystone.Field.Types;
const NFTBase = require('../baseModel/NFTBase');
const statics = require('../routes/utility/statics');

/**
 * LAND
 * ==========
 */
const NftSgModel = new keystone.List('NftSgModel', {
	inherits: NFTBase,
	track: { createdAt: true, updatedAt: false, updatedBy: false, createdBy: true },
	defaultSort: '-createdAt',
	nodelete: true,
	nocreate: true,
	hidden: true,
	schema: {
		usePushEach: true,
	},
	label: 'Sg',
	map: { name: 'description' },

});
NftSgModel.add({
	discount: {type: Types.Number, required: true, initial: true, label:'Discount Active'}
});

/**
 * Registration
 */
NftSgModel.defaultColumns = '_id,modelId, typeNFT, price, description, discount';
NftSgModel.register();
