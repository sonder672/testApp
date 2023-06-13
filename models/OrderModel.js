const keystone = require('keystone');
const Types = keystone.Field.Types;
const statics = require('./../routes/utility/statics');

/**
 * Order User
 * ==========
 */
const OrderModel = new keystone.List('OrderModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Order',
	searchFields: 'buyer',
	noedit: true,
	nocreate: true,
	nodelete: true,
	hidden: true,
});

OrderModel.add({
	datePurchase:{ type: Types.Datetime ,required: true, initial: true, label:"Date of purchase"},
	buyer: { type: Types.Text, required: true, initial: true },
	price: { type: Types.Number, required: true, initial: true},
	amount: { type: Types.Number, required: true, initial: true },
	amount_paid: { type: Types.Number, required: true, initial: true},
	blockNumber: { type: Types.Text, required: true },
	purchase_type: {
		type: Types.Relationship, ref:'NFTBase',
	},
	transactionHash: { type: Types.Text, required: true, initial: true, label: 'Transaction Hash'},
});

/**
 * Registration
 */
OrderModel.defaultColumns = 'TransactionHash, buyer, purchase_type, amount, amount_paid';
OrderModel.register();
