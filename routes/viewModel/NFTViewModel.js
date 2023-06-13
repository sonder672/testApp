var keystone = require('keystone');
var NftSgModel = keystone.list('NftSgModel')
var NftComboModel = keystone.list('NftComboModel')
var NftLiquidModel = keystone.list('NftLiquidModel')
const getNfts = async function (){
	nftLists = [];
    projection = {
        modelId : 1,
        price: 1,
        typeNFT: 1,
        discount: 1,
        _id:0
    }
    nftLists[0] = await NftSgModel.model.find({},projection).lean();
    nftLists[1] =await NftComboModel.model.find({},projection).lean();
    nftLists[2] =await NftLiquidModel.model.find({},{modelId:1, price:1, typeNFT:1,_id:0}).lean();
    return nftLists;
}

exports.getNfts = getNfts;