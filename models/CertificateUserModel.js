const keystone = require('keystone');
const Types = keystone.Field.Types;

const CertificateModel = new keystone.List('CertificateModel',{
	track: { createdAt: true },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Certificados',
	searchFields:'transactionHash',
	nocreate: false,
	noedit:false,
	nodelete:false
});

const storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: './public/uploads/certificates',
		publicPath: '/public/uploads/certificates',
		generateFilename: (file) => {
			const ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
			return `${file.filename}.${ext}`;
		}
	},
});
CertificateModel.add({
    user:{
        type: Types.Relationship, ref:'UserModel', initial: true, label:'Usuario'
    },
    event:{
        type: Types.Relationship,
        ref:'EventModel',initial: true,
		label:'Evento'
    },
    transactionHash:{
        type: Types.Text,default:"0x000000000000000000",
    },
    photo: {
		type: Types.File,
		storage: storage,initial: true,
		label:"Foto"
	},
	url:{
		type:Types.Url,
		default:`${process.env.BASE_URL}`,
		required:true,
		label: 'Certificate Model'
	}
})

CertificateModel.schema.pre('save',function(next){
	this.url = `${process.env.BASE_URL}/uploads/certificates/${this.photo.filename}`
	if(this.url == '' || this.event == null || this.user == null || this.photo?.filename == null || this.transactionHash == '')
		next(new Error('An Empty field was detected!'));
	next();
})


CertificateModel.defaultColumns = 'user event url'
CertificateModel.register();
