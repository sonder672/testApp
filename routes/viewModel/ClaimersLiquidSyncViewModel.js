var keystone = require('keystone');
let ClaimersLiquidModel = keystone.list('ClaimersLiquidModel');
let NftLiquidModel = keystone.list('NftLiquidModel');
let MintedNftModel = keystone.list('MintedNftModel');

const setClaimList = async (obj)=>{
    try {
        await ClaimersLiquidModel.model.findOneAndUpdate({user:{$regex:obj.user,$options:'i'}},{$set:obj},{upsert:true});
    } catch (error) {
        console.log(error);
    }
}

const saveClaimedNft = async (user,nftType,nftIdList,transactionHash)=>{
    try {
        let exist = await  MintedNftModel.model.findOne({transactionHash: transactionHash});
        if(exist){
            let modelId = require('../viewModel/CommonViewModel').getItem(nftType);
            let sub = {}
            switch (modelId) {
                case 1:
                    sub.LiquidType1 = 0;
                    await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 2:
                    sub.LiquidType2 = 0;
                    await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 3:
                    sub.LiquidType3 = 0;
                    await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 4:
                    sub.LiquidType4 = 0;
                    await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 5:
                    sub.LiquidType5 = 0;
                    await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
            }
            return false;
        }

        let modelId = require('../viewModel/CommonViewModel').getItem(nftType);
        let nft = await NftLiquidModel.model.findOne({modelId: modelId});
        
        for(let i = 0; i < nftIdList.length; i++){

            let data = new MintedNftModel.model({
                user: user,
                NftId: nftIdList[i],
                NftMinted: nft,
                transactionHash: transactionHash,
                dateMinted: new Date()
            });

            await data.save((err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        let sub = {}
        switch (modelId) {
            case 1:
                sub.LiquidType1 = 0;
                await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 2:
                sub.LiquidType2 = 0;
                await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 3:
                sub.LiquidType3 = 0;
                await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 4:
                sub.LiquidType4 = 0;
                await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 5:
                sub.LiquidType5 = 0;
                await ClaimersLiquidModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.setClaimList = setClaimList
exports.saveClaimedNft = saveClaimedNft;