var keystone = require('keystone');
let URIModel = keystone.list('URIModel');

const saveNewURI = async (url, nft)=>{
    try {
        await URIModel.model.findOneAndUpdate({ nft: nft },{$set:{url:url}});
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.saveNewURI = saveNewURI;