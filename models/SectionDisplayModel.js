const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Discounts
 * ==========
 */
const SectionDisplayModel = new keystone.List('SectionDisplayModel', {
	track: { createdAt: false, updatedAt: true, updatedBy: true, createdBy: true },
	defaultSort: '-createdAt',
    nodelete: true,
    nocreate: true,
	schema: {
		usePushEach: true,
	},
	label: 'Display Section',
	map: { name: 'Display' },
	hidden:true
});

SectionDisplayModel.add({
    Display:{type: Types.Text,required: true,initial: true, label:"Name Section"},
    CanDisplay:{type: Types.Boolean, default:false,initial: true, label:"Display Section"},
});

SectionDisplayModel.defaultColumns = 'Display,CanDisplay';
SectionDisplayModel.register();