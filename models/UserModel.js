const keystone = require('keystone');
const Types = keystone.Field.Types;
const Firebase = require('../Firebase/Firebase');
//let InitialData = false;
/**
 * User Model
 * ==========
 */
const UserModel = new keystone.List('UserModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: true, createdBy: true },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Usuarios',
	map: { name: 'email' },
	nocreate: false,
	nodelete: true,
	hidden: false
});
// const storage = new keystone.Storage({
// 	adapter: keystone.Storage.Adapters.FS,
// 	fs: {
// 		path: 'public/uploads/',
// 		publicPath: '/public/uploads/',
// 	},
// });
UserModel.add({
	fullName: {
		type: Types.Text,
		required: true,
		initial:true,
		label:'Nombre Completo'
	},
	email: {
		type: Types.Text,
		initial: true,
		unique: true,
		default: '',
		label:'Correo'
	},
	dni: {
		type: Types.Text,
		initial: true,
		unique: true,
		default: '',
	},
	nit:{type: Types.Text,initial:true},
	business: { type: Types.Text, default: '',initial:true,label:'Empresa'},
	residence:{ type: Types.Text, default:'', initial:true, label:'Domicilio'},
	activities:{ type: Types.Text, default:'', initial:true,label:'Rubro de actividades'},
	commercialBrand:{ type: Types.Text, default:'', initial:true, label:"Marca Comercial"},
	legalRepresentant: {type: Types.Text, default:'', initial:true, label:'Representante Legal'},
	canParticipateInEvents: {type: Boolean, default: true, initial:true, label:'Acceso al evento'},
	representative:{type:Types.Text, default:'', initial:true, label:"Apoderado"},
	Assistant:{type: Boolean, default:false, initial:true, label:'Asistente a capacitacion'},
	needRepresentationFisicalOrDigitalDocument:{type: Boolean, default: false, initial:true, label:'Representacion o habilitacion con documento fisico o digital'},
	metamask:{type: Boolean, default:false, initial:true, label:'Use Metamask'}
});

// UserModel.schema.pre('save',async function(next){
// 	this.userID = await Firebase.db.collection('users').where('email','==',this.email);
// })
UserModel.schema.pre('save',async function(next){
	try {
		const user = {
			email:this.email,
			password:this.email
		}
		await Firebase.createUser(user);
		next();
	} catch (error) {
		if(error.code == 'auth/email-already-in-use'){
			return next();
		}
		next(new Error(error.code));
	}
})

// UserModel.schema.post('save', async function (next) {
	
// 	await Firebase.db.collection('users').add({
// 		fullName:this.fullName,
// 		email:this.email,
// 		dni:this.dni,
// 		business:this.business,
// 		photo:''
// 	}).then((user)=>{
// 		next()
// 	}).catch(err=> new Error(err.message));
// });

/**
 * Registration
 */

UserModel.defaultColumns = 'fullName, dni, business, email, nit, business, residence, activities, commercial brand, legalRepresentant,canParticipateInEvents,representative,Assistant';
UserModel.register();
