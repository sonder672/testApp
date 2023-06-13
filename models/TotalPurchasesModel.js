const keystone = require('keystone');
const Types = keystone.Field.Types;
const statics = require('./../routes/utility/statics');

/**
 * Total Purchased
 * ==========
 */
const totalPurchased = new keystone.List('TotalPurchasesModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Total Purchase',
	noedit: true,
	nocreate: true,
	nodelete: true,
	hidden: true,
});

totalPurchased.add({
	total_received:{ type: Types.Number, required: true, initial: true,label: 'Total Received'},
	quantity: { type: Types.Number, required: true, initial: true},
	purchase_type: {
		type: Types.Relationship, ref:'NFTBase',
		label:'Type Of NFT'
	},
});

/**
 * Registration
 */
totalPurchased.defaultColumns = 'total_received,quantity, purchase_type';
totalPurchased.register();