const keystone = require('keystone');
const TotalPurchasesModel = keystone.list('TotalPurchasesModel');

const getPurchaseIncrements = async function getPurchaseIncrements(nft) {
    var seqDoc = await TotalPurchasesModel.model.findOne(
    {
        purchase_type:nft
    },{ quantity:1, total_received:1 });
  
    return seqDoc;
  }

exports.getPurchaseIncrements = getPurchaseIncrements;