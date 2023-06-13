const keystone = require('keystone');
const UserModel = keystone.list('UserModel');
// const UserCrisolModel = keystone.list('UserCrisolModel');
// const UserBecaModel = keystone.list('UserBecaModel');
// const UserStoneModel = keystone.list('UserStoneModel');
const WalletModel = keystone.list('WalletModel');
const EventModel = keystone.list('EventModel');
//const UserWeaponModel = keystone.list('UserWeaponModel');
const NftLiquidModel = keystone.list('NftLiquidModel');
const NftSgModel = keystone.list('NftSgModel');
const NftComboModel = keystone.list('NftComboModel');
const NftPhotoModel = keystone.list('NftPhotoModel');
const InitialData = require('./InitialData');
const ImagePathUtils = require('./ImagePathUtils');
const DateFromBlock = require('./../bscscan/DateFromBlock');
const MintedNftModel = keystone.list('MintedNftModel');
// WEAPON: 1, LAND: 2, CHARACTER: 3

const syncNftCommon = async (modelInstance, typeNFT, typeNFTId, raw, owner, tokenId, metadata, seller) => {
	try {
		const blockNumber = Number(raw.blockNumber);
		const insertProjection = {
			user: 1,
			tokenId: 1,
			blockNumber: 1,
			typeNFT: 1,
			type: 1,
			state: 1,
		};

		const exist = await modelInstance.model.findOne({ tokenId: `${tokenId}`, source: metadata.source, typeNFT: typeNFTId  }, insertProjection).lean();
		let sellingAt = false;
		if (metadata.state === 'SELLING') {
			sellingAt = await DateFromBlock.GetTimeFromBlockNumber(blockNumber);
		}

		if (!exist) {
			const user = await InitialData.onUserInitialData(owner);
			const SetQuery = Object.assign({
					birthTime: await DateFromBlock.GetTimeFromBlockNumber(blockNumber),
					tokenId: `${tokenId}`,
					typeNFT: typeNFTId,
					type: typeNFT,
					user: user._id,
					blockNumber: blockNumber,
					updatedAt: await DateFromBlock.GetTimeFromBlockNumber(blockNumber),
					createdAt: await DateFromBlock.GetTimeFromBlockNumber(blockNumber),
					...metadata
					// image: ImagePathUtils.imagePathCrisol(modelId, tokenId),
				},
				/*await ImagePathUtils.crisolMetadata(modelId, tokenId, user._id.toString())*/
				{}
			);
			if (sellingAt) {
				SetQuery.sellingAt = sellingAt;
			}
			if (metadata.state) {
				SetQuery.state = metadata.state;
			} else {
				SetQuery.state = 'IDLE';
			}
			if (metadata.price) {
				SetQuery.price = metadata.price;
			} /*else {
				SetQuery.price = 0;
			}*/
			if (seller) {
				const sellerUser = await InitialData.onUserInitialData(seller);
				SetQuery.seller = sellerUser._id;
			}
			return await modelInstance.model.findOneAndUpdate({
				tokenId: `${tokenId}`,
			}, {
				$set: SetQuery,
			}, {
				upsert: true,
				new: true,
				projection: insertProjection,
			}).lean();
		} else {
			if (exist.blockNumber > blockNumber) {
				return exist;
			} else {
				const user = await InitialData.onUserInitialData(owner);
				if (exist.blockNumber === blockNumber && user._id.toString() === exist.user.toString() && exist.state === metadata.state) {
					return exist;
				} else {

					const SetQuery = {
						user: user._id,
						blockNumber: blockNumber,
						updatedAt: await DateFromBlock.GetTimeFromBlockNumber(blockNumber),
						// price: metadata.price,
						...metadata
					};
					if (sellingAt) {
						SetQuery.sellingAt = sellingAt;
					}
					if (metadata.price) {
						SetQuery.price = metadata.price;
					} /*else {
						SetQuery.price = 0;
					}*/
					if (metadata.state) {
						SetQuery.state = metadata.state;
					}

					if (seller) {
						const sellerUser = await InitialData.onUserInitialData(seller);
						SetQuery.seller = sellerUser._id;
					}
					if (!SetQuery.state || SetQuery.state === 'IDLE') {
						SetQuery.seller = null;
					}
					return await modelInstance.model.findOneAndUpdate({
						tokenId: `${tokenId}`,
					}, {
						$set: SetQuery,
					}, {
						upsert: true,
						new: true,
						projection: insertProjection,
					}).lean();
				}
			}
		}
	} catch (e) {
		console.log('syncNftCommon', e);
	}
};

const getNft = async(modelId,typeNFT)=>{
	let list;
	switch(typeNFT){
		case "SG":{
			list = NftSgModel;
			break;
		}
		case "COMBO":{
			list = NftComboModel;
			break;
		}
		case "LIQUID":{
			list = NftLiquidModel;
			break;
		}
	}
	return await list.model.findOne({typeNFT:typeNFT,modelId:modelId});
}
const updatePrice = async(modelId,typeNFT,price)=>{
	let list;
	switch(typeNFT){
		case "SG":{
			list = NftSgModel;
			break;
		}
		case "COMBO":{
			list = NftComboModel;
			break;
		}
		case "LIQUID":{
			list = NftLiquidModel;
			break;
		}
	}
	await list.model.findOneAndUpdate({modelId:modelId},{$set:{price:price}});
}
const saveCurrentDiscount = async function (mydiscount){
	mydiscount = mydiscount / 100;
	await NftSgModel.model.updateMany({},{$set:{discount:mydiscount}});
	await NftComboModel.model.updateMany({},{$set:{discount:mydiscount}});
}

const nftPhotoSyncWallet = async function (wallet,eventId,hash,NftId) {
	try {
		const exists = 	await MintedNftModel.model.findOne({NftId:NftId},).lean()
		if(exists)
			return true;
	
		const userWallet = await WalletModel.model.findOne({wallet:wallet.toLowerCase()}).lean();
		if(!userWallet)
			return true;
		const event = await EventModel.model.findOne({eventId:eventId}).lean()
		const data =  await NftPhotoModel.model.findOneAndUpdate({$and:[{user:userWallet.user},{event:event._id}]},{$set:{transactionHash:hash}},{new:true})
		await MintedNftModel.model.create({photo:data,user:userWallet,NftId:NftId});
		return true
	} catch (error) {
		throw error;
	}
}

exports.syncNftCommon = syncNftCommon;
exports.getNft = getNft;
exports.saveCurrentDiscount = saveCurrentDiscount;
exports.updatePrice = updatePrice;
exports.nftPhotoSyncWallet = nftPhotoSyncWallet;
