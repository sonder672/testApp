const keystone = require('keystone');
const Types = keystone.Field.Types;

const SessionModel = new keystone.List('SessionModel', {
	track: { createdAt: true, updatedAt: false, updatedBy: false, createdBy: false },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	hidden: true,
	noedit: true,
	nocreate: true,
	nodelete: true,
});

SessionModel.add({
	user: { type: Types.Relationship, ref: 'UserModel', initial: true },
	token: { type: Types.Text, required: true, default: false },
	sync: { type: Types.Boolean, required: false, default: false, initial: false, noedit: true },
	expire: {
		type: Types.Datetime,
		required: true,
		default: new Date(new Date().setHours(new Date().getHours() + 6)),
	},
});

/**
 * Registration
 */
SessionModel.defaultColumns = 'user, expire, token';
SessionModel.register();
