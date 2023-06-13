const keystone = require('keystone');
const Types = keystone.Field.Types;

const NftPhoto = new keystone.List('NftPhotoModel',{
	track: { createdAt: true },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Nft Gallery',
	nocreate: true,
	noedit:true,
	nodelete:true
});

const storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: './public/uploads/',
		publicPath: '/public/uploads/',
		generateFilename: (file) => {
			const ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
			return `${file.filename}.${ext}`;
		}
	},
});
NftPhoto.add({
    user:{
        type: Types.Relationship, ref:'UserModel', initial: true
    },
    event:{
        type: Types.Relationship,
        ref:'EventModel',initial: true
    },
    transactionHash:{
        type: Types.Text,initial: true,
    },
    photo: {
		type: Types.File,
		storage: storage,initial: true
	},
	url:{
		type:Types.Url,
		default:process.env.BASE_URL,
		required:true,
		initial:true,
		label: 'NFT URL'
	}
})


NftPhoto.schema.pre('save',function (next){
	try {
		this.url = process.env.BASE_URL+'/uploads/'+this.photo.filename;
		next();
	} catch (e) {	
		throw new Error('Error while saving');
	}
})

NftPhoto.register()
NftPhoto.defaultColumns = 'user,event,url,createdAt'

