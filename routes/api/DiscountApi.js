var DiscountViewModel = require('../viewModel/DiscountViewModel');
const getDiscounts = async (req,res)=>{
    try {
        let discount = await DiscountViewModel.getAllDiscounts();
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({error: error});
    }
}
// const testDelete = (req, res) => {
//     res.status(201).json({message:"delete"});
// }
exports.getDiscounts = getDiscounts;
// exports.testDelete = testDelete;
