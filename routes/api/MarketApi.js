const TokenViewModel = require('./../viewModel/TokenViewModel');
const ERRORS = require('./../utility/errors').ERRORS;

const getSellingList = async (req, res) => {
    try {
        const data = (req.method === 'POST') ? req.body : req.query;
        if (!data.state) {
            data.state = 'SELLING';
        }
        const info = await TokenViewModel.getFilterList(null, data);
        return res.apiResponse(info);
    } catch (e) {
        if (e && !e.internalCode) {
            console.log('MarketApi:getSellingList', e);
        }
        return res.apiErrorMine(e);
    }
};

const getSellingWeaponList = async (req, res) => {
	try {
		const data = (req.method === 'POST') ? req.body:req.query;
		if (!data.state) {
			data.state = 'SELLING';
		}
		const info = await TokenViewModel.getFilterWeaponList(null, data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('MarketApi:getSellingCrisolList', e);
		}
		return res.apiErrorMine(e);
	}
};

const getSellingLandList = async (req, res) => {
    try {
        const data = (req.method === 'POST') ? req.body:req.query;
        if (!data.state) {
        	data.state = 'SELLING';
        }
        const info = await TokenViewModel.getFilterLandList(null, data);
        return res.apiResponse(info);
    } catch (e) {
        if (e && !e.internalCode) {
            console.log('MarketApi:getSellingCrisolList', e);
        }
        return res.apiErrorMine(e);
    }
};

const getSellingCharacterList = async (req, res) => {
    try {
        const data = (req.method === 'POST') ? req.body:req.query;
        if (!data.state) {
        	data.state = 'SELLING';
        }
        const info = await TokenViewModel.getFilterCharacterList(null, data);
        return res.apiResponse(info);
    } catch (e) {
        if (e && !e.internalCode) {
            console.log('MarketApi:getSellingCrisolList', e);
        }
        return res.apiErrorMine(e);
    }
};

exports.getSellingWeaponList = getSellingWeaponList;
exports.getSellingLandList = getSellingLandList;
exports.getSellingCharacterList = getSellingCharacterList;
exports.getSellingList = getSellingList;

