const keystone = require('keystone');
const Types = keystone.Field.Types;
const NFTBase = require('../baseModel/NFTBase');
const statics = require('../routes/utility/statics');

/**
 * LAND
 * ==========
 */
const NftComboModel = new keystone.List('NftComboModel', {
	inherits: NFTBase,
	track: { createdAt: true, updatedAt: false, updatedBy: false, createdBy: true },
	defaultSort: '-createdAt',
	nodelete: true,
	nocreate: true,
	hidden: true,
	schema: {
		usePushEach: true,
	},
	label: 'Combos',
	map: { name: 'modelId' },

});

NftComboModel.add({
    Card: { type: Types.Select, options:statics.NFT_CARDS, label: 'Card', required: true, initial: true},
    Liquid: { type: Types.Select, options:statics.NFT_LIQUID, label: 'Liquid', required: true, initial: true},
	discount: {type: Types.Number, required: true, initial: true, label:'Discount Active'}
});
/**
 * Registration
 */
NftComboModel.defaultColumns = 'modelId, typeNFT, price, description, discount';
NftComboModel.register();
