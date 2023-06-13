var keystone = require('keystone');
let ClaimersModel = keystone.list('ClaimersModel');
let NftSgModel = keystone.list('NftSgModel');
let MintedNftModel = keystone.list('MintedNftModel');

const setClaimList = async (obj) => {
    try {
        await ClaimersModel.model.findOneAndUpdate({ user: { $regex: obj.user, $options: 'i' } }, { $set: obj }, { upsert: true });
    } catch (error) {
        console.log(error);
    }
}

const saveClaimedNft = async (user, nftType, nftIdList, transactionHash) => {
    try {
        let exist = await MintedNftModel.model.findOne({ transactionHash: transactionHash });
        if (exist) {
            let modelId = require('../viewModel/CommonViewModel').getItem(nftType);
            let sub = {};
            switch (modelId) {
                case 1:
                    sub.sgType1 = 0
                    await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 2:
                    sub.sgType2 = 0;
                    await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 3:
                    sub.sgType3 = 0;
                    await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 4:
                    sub.sgType4 = 0;
                    await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
                case 5:
                    sub.sgType5 = 0;
                    await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                    break;
            }
            return false;
        }
        let modelId = require('../viewModel/CommonViewModel').getItem(nftType);
        let nft = await NftSgModel.model.findOne({ modelId: modelId });

        for (let i = 0; i < nftIdList.length; i++) {

            let data = new MintedNftModel.model({
                user: user.toLowerCase(),
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
        let sub = {};
        switch (modelId) {
            case 1:
                sub.sgType1 = 0
                await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 2:
                sub.sgType2 = 0;
                await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 3:
                sub.sgType3 = 0;
                await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 4:
                sub.sgType4 = 0;
                await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
                break;
            case 5:
                sub.sgType5 = 0;
                await ClaimersModel.model.findOneAndUpdate({ user: { $regex: user, $options: 'i' } }, { $set: sub })
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