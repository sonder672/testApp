const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Block Smart Contract Model Types
 * ==========
 */
const BlockModel = new keystone.List('BlockModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false },
	schema: {
		usePushEach: true,
	},
	nocreate: true,
	nodelete: true,
	hidden: true,
});

BlockModel.add({
	key: { type: Types.Text, required: true, default: 'unique', unique: true },
	value: { type: Types.Number, required: false, default: 0 },
});

/**
 * Registration
 */
BlockModel.defaultColumns = 'id, key, value';
BlockModel.register();
