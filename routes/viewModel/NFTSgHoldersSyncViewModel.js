var keystone = require('keystone');
var NftSgHolderModel = keystone.list('NftSgHolderModel');
var NftSgModel = keystone.list('NftSgModel');

/***************************
* @param {String} Owner the wallet of the NFT Owner
* @param {Array} sgTokenArray Integer array for the id of the NFT
* @param {Integer} sgModel integer that contains the NFT Number Model of SG
*/
const savePurchaseHolder = async (Owner,sgTokenArray,modelId) => {
    try {
        if(sgTokenArray.length > 0 && !(sgTokenArray.includes('0') || sgTokenArray.includes(0))){
        nft = await NftSgModel.model.findOne({modelId});
            for(let i = 0; i < sgTokenArray.length;i++){
                let data = await new NftSgHolderModel.model({
                    NftId: sgTokenArray[i],
                    NftType: nft,
                    Owner: Owner.toLowerCase()
                })
                data.save((err)=>{
                    if(err){
                        console.log(err)
                    }
                })     
            }
        } 
    } catch (error) {
        console.log('An error has ocurred');
        throw error;
    }

}

const syncTransfer = async (Owner,NftId)=>{
    try {
        await NftSgHolderModel.model.findOneAndUpdate({NftId},{$set:{Owner:Owner, updatedAt: new Date()}})
    } catch (error) {
        console.log(error);
    }
}

const saveClaimHolder = async (Owner,nftIdList, modelId)=>{
    try {
            let nft = await  NftSgModel.model.findOne({modelId});
            for (let i = 0; i < nftIdList.length; i++) {
                let data = new NftSgHolderModel.model({
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

exports.savePurchaseHolder = savePurchaseHolder;
exports.syncTransfer = syncTransfer;
exports.saveClaimHolder = saveClaimHolder;