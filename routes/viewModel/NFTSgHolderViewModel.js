var keystone = require('keystone');
let NFTSgHolderModel = keystone.list('NftSgHolderModel');

const getUserNFTs = async (Owner,skip)=>{
    let projection = {
        _id:0,
        updatedAt: 0,
        createdAt: 0,
        __v: 0,
    };
    try {        
        const items = await NFTSgHolderModel.model.find({Owner:{$regex:Owner,$options:'i'}},projection).populate({path:'NftType',select:{modelId:1,typeNFT:1,_id:0,__t:0,description:1}}).sort({NftId:-1}).skip(skip*9).limit(9);        
        return items;
    } catch (error) {
        console.log(error);
    }
}

exports.getUserNFTs = getUserNFTs;