const OrderViewModel = require('./../viewModel/OrderViewModel');

const getOrdersByNftId = async (req, res) => {

	try {
		const data = (req.method === 'POST') ? req.body:req.query;
		const info = await OrderViewModel.getOrdersByNftId(req.params.tokenId, data.limit, data.skip, data.state, data.type);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('MarketApi:getOrders', e);
		}
		return res.apiErrorMine(e);
	}
};

exports.getOrdersByNftId = getOrdersByNftId;
