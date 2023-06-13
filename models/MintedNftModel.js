var keystone = require('keystone');
var Types = keystone.Field.Types;


let MintedNftModel = new keystone.List('MintedNftModel',{
    track:{createdAt: true, updatedAt: true, updatedBy: false, createdBy: false},
    defaultsort:'-createdAt',
    schema: {
		usePushEach: true,
	},
    label:'Minted NFT',
    searchFields:'wallet',
    hidden:true
});

MintedNftModel.add({
    photo:{ type: Types.Relationship, ref:'NftPhotoModel', require: true, initial: true},
    NftId:{type: Types.Number, required : true, initial: true, label:'Nft Id',unique:true},
    wallet:{type:Types.Relationship, ref:'WalletModel', require: true, initial:true}
})

MintedNftModel.defaultColumns = 'photo,NftId,wallet';
MintedNftModel.register();