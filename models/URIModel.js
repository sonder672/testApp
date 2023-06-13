var keystone = require('keystone');
let Types = keystone.Field.Types;

const URIModel = new keystone.List('URIModel',{
	track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: true },
	defaultSort: '-createdAt',
	nodelete: true,
	nocreate: true,
    noedit:true,
	schema: {
		usePushEach: true,
	},
	label: 'URL OF NFT',
	hidden: true,
	map: { name: 'url' },
});

URIModel.add({
    nft:{type:Types.Text, required:true, initial:true, label:'Nft'},
    url:{type:Types.Url, required:true, initial:true, label:'URL'}
});

URIModel.register();