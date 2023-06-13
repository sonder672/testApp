let NFTSgHolderModel = require('../viewModel/NFTSgHolderViewModel');
let NFTLiquidHolderModel = require('../viewModel/NFTLiquidHolderViewModel');
const getUserSgNft = async (req, res) => {
	try {
		const {Owner,skip} = req.query;
        let data = await NFTSgHolderModel.getUserNFTs(Owner,Number(skip));
        res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(500).json({error:error});
	}
}

const getUserLiquidNft = async(req,res)=>{
	try {
		const {Owner,skip} = req.query;
        let data = await NFTLiquidHolderModel.getUserNFTs(Owner,Number(skip));
        res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(500).json({error:error});
	}
}

exports.getUserSgNft = getUserSgNft;
exports.getUserLiquidNft = getUserLiquidNft;