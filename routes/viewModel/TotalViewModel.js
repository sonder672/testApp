var keystone = require('keystone');
var totalModel = keystone.list('TotalModel');
/** 
* @param {Number} total total received selling nft (GAIN), 
* @param {String} typenft Type of NFT ('SG','COMBO','LIQUID')
* @param {Number} totalUnits totalUnits of nft selled
*/
const saveTotal = async (total,typenft,totalUnits) =>{
    try{
    let currentTotalNftType = await totalModel.model.findOne({description:typenft},{totalReceived:1, totalUnits:1});
    currentTotalNftType.totalReceived = currentTotalNftType.totalReceived + total;
    currentTotalNftType.totalUnits = currentTotalNftType.totalUnits + totalUnits;
    let currentTotal = await totalModel.model.findOne({description:"TOTAL"},{totalReceived:1, totalUnits:1});
    await totalModel.model.findOneAndUpdate({description:typenft},{$set:{totalReceived:currentTotalNftType.totalReceived, totalUnits:currentTotalNftType.totalUnits}});
    currentTotal.totalReceived = currentTotal.totalReceived + total;
    currentTotal.totalUnits = currentTotal.totalUnits + totalUnits;
    await totalModel.model.findOneAndUpdate({description:"TOTAL"},{$set:{totalReceived:currentTotal.totalReceived, totalUnits:currentTotal.totalUnits}});
    } catch (e) {
        console.log("error "+e);
    }
}


exports.saveTotal = saveTotal;
