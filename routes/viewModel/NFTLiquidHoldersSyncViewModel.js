var keystone = require('keystone');
var NftLiquidHolderModel = keystone.list('NftLiquidHolderModel');
var NftLiquidModel = keystone.list('NftLiquidModel');

/***************************
* @param {String} Owner the wallet of the NFT Owner
* @param {Array} sgTokenArray Integer array for the id of the NFT
* @param {Integer} sgModel integer that contains the NFT Number Model of SG
*/
const savePurchaseHolder = async (Owner, liquidTokenArray, modelId) => {
    try {
        if (liquidTokenArray.length > 0 && !(liquidTokenArray.includes('0') || liquidTokenArray.includes(0))) {
            let nft = await NftLiquidModel.model.findOne({ modelId });
            for (let i = 0; i < liquidTokenArray.length; i++) {
                let data = new NftLiquidHolderModel.model({
                    NftId: liquidTokenArray[i],
                    NftType: nft,
                    Owner: Owner.toLowerCase()
                })
                await data.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        }
    } catch (error) {
        console.log('An error has ocurred');
    }

}

const syncTransfer = async (Owner,NftId)=>{
    try {
        await NftLiquidHolderModel.model.findOneAndUpdate({NftId},{$set:{Owner:Owner,updatedAt: new Date()}})
    } catch (error) {
        console.log(error);
    }
}

const saveClaimHolder = async (Owner,nftIdList, modelId)=>{
    try {
            let nft = await NftLiquidModel.model.findOne({ modelId });
            for (let i = 0; i < nftIdList.length; i++) {
                let data = new NftLiquidHolderModel.model({
                    NftId: nftIdList[i],
                    NftType: nft,
                    Owner: Owner
                })
                await data.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
    } catch (error) {
        console.log('An error has ocurred');
    }
}

exports.syncTransfer = syncTransfer;
exports.savePurchaseHolder = savePurchaseHolder;
exports.saveClaimHolder = saveClaimHolder;