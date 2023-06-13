var ClaimersViewModel = require('../viewModel/ClaimersViewModel');

const getClaims = async (req,res)=>{
    try {
        let user = req.params.user;
        let result = await ClaimersViewModel.getAllMyClaims(user);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: error});
    }
}

exports.getClaims = getClaims;

