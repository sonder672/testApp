const keystone = require('keystone');
const Types = keystone.Field.Types;
const NFTBase = require('../baseModel/NFTBase');
const statics = require('../routes/utility/statics');

/**
 * LAND
 * ==========
 */
const NftLiquidModel = new keystone.List('NftLiquidModel', {
	inherits: NFTBase,
	track: { createdAt: true, updatedAt: false, updatedBy: false, createdBy: true },
	defaultSort: '-createdAt',
	nodelete: true,
	nocreate: true,
	hidden: true,
	schema: {
		usePushEach: true,
	},
	label: 'Liquids',
	map: { name: 'description' },

});


/**
 * Registration
 */
NftLiquidModel.defaultColumns = 'modelId, typeNFT, price, description';
NftLiquidModel.register();
