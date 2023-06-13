var keystone = require('keystone');
var Types = keystone.Field.Types;

const NftLiquidHolderModel = new keystone.List('NftLiquidHolderModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false },
	defaultSort: '-NftId',
	schema: {
		usePushEach: true,
	},
	searchFields: 'Owner',
	label: 'NFT LIQUID Current Holders',
    map: {name:"NftType"},
	hidden:true
});

NftLiquidHolderModel.add({
    NftId: {type: Types.Number, required: true, initial: true, label:"Nft Id"},
    NftType:{type:Types.Relationship, ref:"NftLiquidModel", required: true, initial: true, label: "Nft Type"},
    Owner:{type:Types.Text, required: true, initial: true, label:"Wallet"}
});

NftLiquidHolderModel.defaultColumns = 'Owner,NftId,NftType'
NftLiquidHolderModel.register();