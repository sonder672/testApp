const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Describe the user allowed to administrate on keystone
 * ===========
 */
const AdminModel = new keystone.List('AdminModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: true, createdBy: true },
	defaultSort: '-createdAt',
	hidden: !(process.env.IT_IS_BACKEND && process.env.IT_IS_BACKEND === 'true'),
	schema: {
		usePushEach: true,
	},
	label: 'Administradores',
});

AdminModel.add({
	name: { type: Types.Name, required: true, index: true , label:'Nombre'},
	email: {
		type: Types.Email,
		initial: true,
		required: true,
		unique: true,
		index: true,
		label:'Email de acceso'
	},
	password: { type: Types.Password, initial: true, required: true, label:'Contraseña' },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Acceso al keystone', index: true, default: true },
});

// Provide access to Keystone
AdminModel.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Registration
 */
AdminModel.defaultColumns = 'name, email, isAdmin';
AdminModel.register();
