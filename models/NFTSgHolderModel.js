var keystone = require('keystone');
var Types = keystone.Field.Types;

const NftSgHolderModel = new keystone.List('NftSgHolderModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false },
	defaultSort: '-NftId',
	schema: {
		usePushEach: true,
	},
	searchFields: 'Owner',
	label: 'NFT SG Current Holders',
    map: {name:"NftType"},
	hidden:true
});

NftSgHolderModel.add({

    NftId: {type: Types.Number, 
		required: true, 
		initial: true, 
		label:"Nft Id"},

    NftType:{
		type:Types.Relationship, 
		ref:"NftSgModel", 
		required: true, 
		initial: true, 
		label: "Nft Type"},

    Owner:{type:Types.Text, 
		required: true,
		 initial: true, 
		 label:"Wallet"}
});

NftSgHolderModel.defaultColumns = 'Owner,NftId,NftType'
NftSgHolderModel.register();