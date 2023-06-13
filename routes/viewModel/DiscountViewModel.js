var keystone = require('keystone');
var DiscountModel = keystone.list('DiscountModel');

const getAllDiscounts = async ()=>{
    try {
        let projection = {
            _id:0,
            description: 0,
            updatedAt: 0,
            createdAt: 0,
            updatedBy: 0,
            createdBy: 0,
            __v: 0,
        };
        let discountList = await DiscountModel.model.find({DateExpired : {$gt: new Date()}},projection).limit(1).lean();
        return discountList;
    } catch (error) {
        throw error
    }
}
const checkDiscounts = async (today)=>{
    try {
        let projection = {
            _id:0,
            description: 0,
            updatedAt: 0,
            createdAt: 0,
            updatedBy: 0,
            createdBy: 0,
            __v: 0,
        };
        let discountList = await DiscountModel.model.find({DateExpired : {$gt: today}},projection).limit(1).lean();
        return discountList;
    } catch (error) {
        throw error
    }
}

exports.getAllDiscounts = getAllDiscounts;
exports.checkDiscounts= checkDiscounts;