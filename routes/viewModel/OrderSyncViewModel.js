const keystone = require('keystone');
const OrderModel = keystone.list('OrderModel');
const TotalPurchasesModel = keystone.list('TotalPurchasesModel');
const InitialData = require('./InitialData');
const NFTSyncViewModel = require('./NFTSyncViewModel');
const statics = require('./../utility/statics');
const DateFromBlock = require('./../bscscan/DateFromBlock');
const TotalPurchasesViewModel = require('./TotalPurchaseViewModel');
const totalViewModel = require('./TotalViewModel');
const AcumulatedModel = keystone.list('AcumulatedModel');
const OrderCreated = async (modelInstance, orderId, assetId, seller, priceInWei, blockNumber, nftData, raw) => {
	try {
		const order = await OrderModel.model.findOne({ orderId: orderId }, { state: 1 }).lean();
		if (order) {
			return order;
		} else {
			const marketPlaceAddress = process.env.CONTRACT_MARKETPLACE.toLowerCase();

			const nft = await NFTSyncViewModel.syncNftCommon(
				modelInstance, nftData.nftType, nftData.nftTypeId,
				raw, marketPlaceAddress, assetId, { price: priceInWei, state: 'SELLING', source: nftData.source }, seller
			);
			if (!nft) {
				return;
			}
			const execTime = await DateFromBlock.GetTimeFromBlockNumber(blockNumber);
			const sellerUser = await InitialData.onUserInitialData(seller);
			const SetQuery = {
				type: nft.type,
				state: 'OPEN',
				source: nftData.source,
				openHash: raw.transactionHash,
				price: priceInWei,
				seller: sellerUser,
				tokenId: assetId,
				asset: nft._id,
				updatedAt: execTime,
				createdAt: execTime,
			};
			return await OrderModel.model.findOneAndUpdate({ orderId: orderId }, {
				$set: SetQuery,
			}, {
				new: true,
				upsert: true,
				projection: { state: 1 },
			}).lean();
		}

	} catch (e) {
		console.log('OrderCreated', e);
	}
};

const SuccessfulPurchase = async (nftId, nfttype, amount, price, amount_paid, buyer, blockNumber, raw) => {
	try {
		const purchase = await OrderModel.model.findOne({ transactionHash: raw.transactionHash }).lean();
		if (purchase) {
			return false;
		} else {
			console.log(nfttype, nftId);
			const nft = await NFTSyncViewModel.getNft(nfttype, nftId);
			console.log('el nft que se guardara es ' + nft);
			if (!nft) {
				return false;
			}
			//			const execTime = await DateFromBlock.GetTimeFromBlockNumber(blockNumber);
			const SetQuery = {
				datePurchase: new Date(),
				buyer: buyer.toLowerCase(),
				price,
				amount,
				amount_paid,
				blockNumber,
				purchase_type: nft,
				transactionHash: raw.transactionHash,
			};
			const totalNftPurchases = await TotalPurchasesViewModel.getPurchaseIncrements(nft);
			let SetPurchase = {
				purchase_type: nft,
				quantity: (totalNftPurchases?.quantity) ? totalNftPurchases.quantity + amount : amount,
				total_received: (totalNftPurchases?.total_received) ? totalNftPurchases.total_received + amount_paid : amount_paid
			}
			await OrderModel.model.findOneAndUpdate({ transactionHash: raw.transactionHash }, {
				$set: SetQuery,
			}, {
				new: true,
				upsert: true
			}).lean();

			await TotalPurchasesModel.model.findOneAndUpdate({ purchase_type: { $in: nft["_id"] } }, {
				$set: SetPurchase,
			}, {
				new: true,
				upsert: true
			});
			await totalViewModel.saveTotal(amount_paid, nft.typeNFT, amount);
			return true;
		}

	} catch (e) {
		console.log('Error saving the purchase data', e);
		throw e;
	}
}

const OrderSuccessful = async (modelInstance, orderId, assetId, totalPrice, buyer, blockNumber, nftData, raw) => {
	try {
		let order = await OrderModel.model.findOne({ orderId: orderId }, { state: 1 }).lean();
		for (let i = 0; i < 20 && !order; i++) {
			await statics.waitFor(500);
			order = await OrderModel.model.findOne({ orderId: orderId }, { state: 1 }).lean();
		}
		if (order && order.state === 'DONE') {
			return order;
		} else {

			const execTime = await DateFromBlock.GetTimeFromBlockNumber(blockNumber);
			const nft = await NFTSyncViewModel.syncNftCommon(
				modelInstance, nftData.nftType, nftData.nftTypeId,
				raw, buyer, assetId, { price: 0, state: 'IDLE', source: nftData.source });
			if (!nft) {
				return;
			}
			const buyerUser = await InitialData.onUserInitialData(buyer);
			const SetQuery = {
				type: nft.type,
				state: 'DONE',
				buyer: buyerUser,
				closeHash: raw.transactionHash,
				updatedAt: execTime,
			};
			return await OrderModel.model.findOneAndUpdate({ orderId: orderId }, {
				$set: SetQuery,
			}, {
				new: true,
				upsert: true,
				projection: { state: 1 },
			}).lean();
		}

	} catch (e) {
		console.log('OrderSuccessful', e);
	}
};

const OrderCancelled = async (modelInstance, orderId, assetId, seller, blockNumber, nftData, raw) => {
	try {
		let order = await OrderModel.model.findOne({ orderId: orderId }, { state: 1 }).lean();
		for (let i = 0; i < 100 && !order; i++) {
			await statics.waitFor(500);
			order = await OrderModel.model.findOne({ orderId: orderId }, { state: 1 }).lean();
		}
		if (order && order.state === 'CANCEL') {
			return order;
		} else {
			const nft = await NFTSyncViewModel.syncNftCommon(
				modelInstance, nftData.nftType, nftData.nftTypeId,
				raw, seller, assetId, { price: 0, state: 'IDLE', source: nftData.source });
			if (!nft) {
				return;
			}
			const execTime = await DateFromBlock.GetTimeFromBlockNumber(blockNumber);
			const SetQuery = {
				type: nft.type,
				state: 'CANCEL',
				closeHash: raw.transactionHash,
				updatedAt: execTime,
			};
			return await OrderModel.model.findOneAndUpdate({ orderId: orderId }, {
				$set: SetQuery,
			}, {
				new: true,
				upsert: true,
				projection: { state: 1 },
			}).lean();
		}

	} catch (e) {
		console.log('OrderCancelled', e);
	}
};

const setAcumulated = async (type,totalReceived,hash)=>{
	try {
		await AcumulatedModel.model.findOneAndUpdate({description:type},{$set:{totalReceived:totalReceived,hash:hash, updatedAt: new Date()}});
	} catch (error) {
		console.log(error);	
	}
}

exports.SuccessfulPurchase = SuccessfulPurchase;
exports.OrderCreated = OrderCreated;
exports.OrderSuccessful = OrderSuccessful;
exports.OrderCancelled = OrderCancelled;
exports.setAcumulated = setAcumulated;