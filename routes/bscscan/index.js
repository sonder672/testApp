const BSCScan = require('./BSCScan').BSCScan;
const keystone = require('keystone');
const ethers = require('ethers');
const CronJob = require('cron').CronJob;

const NFTSyncViewModel = require('./../viewModel/NFTSyncViewModel');
const OrderSyncViewModel = require('./../viewModel/OrderSyncViewModel');
const BlockModel = keystone.list('BlockModel');
const CommonViewModel = require('./../viewModel/CommonViewModel');
const NFTSgHoldersSyncViewModel = require('../viewModel/NFTSgHoldersSyncViewModel');
const NFTLiquidHoldersSyncViewModel = require('../viewModel/NFTLiquidHoldersSyncViewModel');
const URISyncViewModel = require('../viewModel/URISyncViewModel');
const CertificateViewModel = require('./../viewModel/CertificateViewModel');

var  marketInstance,certificateInstance;

const initContracts = async () => {
	try {
		marketInstance = new BSCScan('./../../contracts/CaceNft.json', process.env.CONTRACT_MARKETPLACE, process.env.BSC_API_PATH);
		certificateInstance = new BSCScan('./../../contracts/CaceCertificate.json', process.env.CONTRACT_SG, process.env.BSC_API_PATH);
		marketInstance.GetContract();
		certificateInstance.GetContract();
	} catch (e) {
		console.log('error_initContracts', e);
	}
};

const initilizeContractSyncronizers = async () => {
	try {
		await initContracts();
		await watchEvents();
		// await reScanPastEvents();
	} catch (e) {
		console.log('initilize bscscan', e);
	}
};


/** ***************************
 * COMMON CODE
 ************************************/
const blockMap = new Map();

const saveCurrentBlockNumber = async (blockNumber, key) => {
	try {
		let savedLastBlock = blockMap.get(key) || 1;
		if (savedLastBlock < blockNumber) {
			const query = { value: blockNumber };
			await BlockModel.model.findOneAndUpdate({ key: key }, {
				$set: query,
			}).lean();

			blockMap.set(key, blockNumber);
		}
	} catch (e) {
		console.log('saveCurrentBlockNumber', e);
	}
};

const getLastBlock = async (key) => {
	try {
		const projection = { key: 1, value: 1 };
		const block = await BlockModel.model.findOne({ key: key }, projection).sort('-createdAt').lean();
		return block ? block.value : Number(process.env.INITIAL_BLOCK);
	} catch (e) {
		console.log('getLastBlock', e);
	}
	return 0;
};

/**
 *
 * @param contractName
 * @param contractInstance
 * @param contractTopics
 * @param processEventsFn
 * @param startScanBlock
 * @returns {Promise<number>}
 */
const checkOldEvents = async (contractName, contractInstance, contractTopics, processEventsFn, startScanBlock) => {
	try {
		let lastBlock = 0;
		console.log(contractName);
		const topics = contractTopics.map(e => ethers.utils.id(e));
		const eventsData = await contractInstance.GetLogs([...topics], startScanBlock);
		for (let i = 0; i < eventsData.events.length; i++) {
			const item = eventsData.decoded[i];
			const raw = eventsData.events[i];
			console.log(item);
			console.log(raw);
			const blockNumber = await processEventsFn(contractInstance, item, raw);
			if (blockNumber > lastBlock) {
				lastBlock = blockNumber;
			}
		}
		if (startScanBlock < 100 && lastBlock < 100) {
			const now = new Date();
			lastBlock = await contractInstance.GetBlockFromTime(new Date().setHours(now.getHours() - 6));
		}
		console.log(`${contractName} done`, startScanBlock, lastBlock);
		return lastBlock;
	} catch (e) {
		console.log(`Error ${contractName}:`, e);
	}
};
/**
 *
 * @param subscriberName
 * @param blockKey
 * @param checkEventsWithParams
 * @param processEventsFn
 * @returns {Promise<void>}
 */
const subscribeEvents = async (subscriberName, blockKey = 'name', checkEventsWithParams, processEventsFn) => {
	console.log('subscriberName:', subscriberName);
	try {
		const contractInstance = checkEventsWithParams.contractInstance;
		const topics = checkEventsWithParams.topics;
		const eventsList = [...topics].map(event => event.substr(0, event.indexOf('(')));
			eventsList.forEach((eventName) => {
			contractInstance.GetContract().on(eventName, async (...args) => {
				if (args.length === 0) return;
				const argsRaw = args.pop();
				try {
					const blockNumber = Number(argsRaw.blockNumber);
					const eventData = CommonViewModel.normalizeValues(args);
					const block = await processEventsFn(contractInstance, {
						name: eventName,
						events: eventData
					}, argsRaw);
					if (block === blockNumber) {
						await saveCurrentBlockNumber(blockNumber, blockKey);
					}
				} catch (e) {
					console.log('e', e);
				}
			});
		});
		const startAnalyseBlock = await getLastBlock(blockKey);
		console.log('startAnalyseBlock:', startAnalyseBlock);


		const lastAnalyse = await checkOldEvents(
			checkEventsWithParams.contractName,
			contractInstance,
			topics,
			processEventsFn,
			startAnalyseBlock + 1
		);

		if (lastAnalyse > startAnalyseBlock) {
			await saveCurrentBlockNumber(lastAnalyse, blockKey);
		}


		// eventsList.forEach((eventName) => {
		// 	contractInstance.GetContract().on(eventName, async (...args) => {
		// 		if (args.length === 0) return;
		// 		const argsRaw = args.pop();
		// 		try {
		// 			const blockNumber = Number(argsRaw.blockNumber);
		// 			const eventData = CommonViewModel.normalizeValues(args);
		// 			const block = await processEventsFn(contractInstance, {
		// 				name: eventName,
		// 				events: eventData
		// 			}, argsRaw);
		// 			if (block === blockNumber) {
		// 				await saveCurrentBlockNumber(blockNumber, blockKey);
		// 			}
		// 		} catch (e) {
		// 			console.log('e', e);
		// 		}
		// 	});
		// });
		console.log(`${subscriberName} done`);
	} catch (e) {
		console.log(`${subscriberName}`, e);
	}
};

const watchEvents = async () => {

	// ------- market events ----------
	await subscribeEvents(
		'subscribeMarketEvents',
		'market',
		{
			contractName: 'oldMarketEvents',
			contractInstance: marketInstance,
			topics: [
				'CreateNft(to, tokenId, eventId)',
				'OwnershipTransferred(index_topic_1 address previousOwner, index_topic_2 address newOwner)'
			],
		},
		processMarketEvent
	);
	await subscribeEvents(
		'subscribeMarketEvents',
		'Sg',
		{
			contractName: 'certificateEvents',
			contractInstance: certificateInstance,
			topics: [
				'certificateCreated(address wallet, uint256 eventId)',
				// 'changedTokenURI(uint _TokenId, string _newUri)',
				'Transfer(index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)',
				'OwnershipTransferred(index_topic_1 address previousOwner, index_topic_2 address newOwner)'
			],
		},
		processMarketEvent
	);
	console.log('===> market subscriptions done!');

	// const subscribeSg = subscribeEvents(
	// 	'subscribeSgEvents',
	// 	'Sg',
	// 	{
	// 		contractName: 'oldSgEvents',
	// 		contractInstance: SgInstance,
	// 		topics: [
	// 			'Transfer(address,address,uint256)',
	// 			'SetBaseURI(_newBaseURI)'
	// 		],
	// 	},
	// 	processSgEvents
	// );

	// const subscribeLiquid = subscribeEvents(
	// 	'subscribeLiquidEvents',
	// 	'Liquid',
	// 	{
	// 		contractName: 'oldLiquidEvents',
	// 		contractInstance: LiquidInstance,
	// 		topics: [
	// 			'Transfer(address,address,uint256)',
	// 			'SetBaseURI(_newBaseURI)'
	// 		],
	// 	},
	// 	processLiquidEvents
	// );


	// await Promise.all([
	// 	subscribeSg,
	// 	subscribeLiquid
	// ]).then(values => {
	// 	console.log('===> subscriptions done!');
	// }, reason => {
	// 	console.log('subscriptions fail!')
	// });

}



const processCommonEvents = async (contractInstance, event, raw, typeNFT) => {
	console.log('getting data about NFTs:', contractInstance.GetContractAddress(), typeNFT, event.name);
	try {
		if (event?.name) {
			switch (event.name) {
				case 'Transfer': {
					const from = event.events[0].value.toLowerCase();
					const to = event.events[1].value.toLowerCase();
					const nftId = event.events[2].value;

					if (from !== process.env.DEFAULT_WALLET) {
						switch (typeNFT) {
							case 'SG': {
								NFTSgHoldersSyncViewModel.syncTransfer(to, nftId);
								break;
							}
							case 'LIQUID': {
								NFTLiquidHoldersSyncViewModel.syncTransfer(to, nftId);
								break;
							}
						}
					}
					break;
				}
				case 'SetBaseURI': {
					const url = event.events[0].value;
					URISyncViewModel.saveNewURI(url, typeNFT);
					break;
				}
			}
		}
		return Number(raw.blockNumber);
	} catch (e) {
		return 0;
	}
};



/** ***************************
 * SG CONTRACT
 ******************************/

const processSgEvents = async (contractInstance, event, raw) => {
	return processCommonEvents(contractInstance, event, raw, 'SG');
};

/** ***************************
 * LIQUID CONTRACT
 ******************************/

const processLiquidEvents = async (contractInstance, event, raw) => {
	return processCommonEvents(contractInstance, event, raw, 'LIQUID');
};


/** ***************************
 * MARKET CONTRACT
 ******************************/

const processMarketEvent = async (contractInstance, event, raw) => {

	if (event && event.name) {
		console.log("*******************************************************************************");
		console.log("<<");
		console.log([
			`process_market_Events`,
			contractInstance.GetContractAddress(),
			event.name
		]);
		console.log("events::values:");
		event.events.map(e => console.log(e));
		console.log('raw:', raw);
		console.log(">>");
		console.log("*******************************************************************************");
	}

	try {
		if (event?.name) {
			const blockNumber = Number(raw.blockNumber);
			switch (event.name) {
				case 'CreateNft': {
					const wallet = event.events[0].value ?? +event.events[0];
					const tokenId = +event.events[1].value ?? +event.events[1];
					const eventId = +event.events[2].value ?? +event.events[2];

					console.log(`processing ${wallet} ${eventId} ${tokenId}`);
					await NFTSyncViewModel.nftPhotoSyncWallet(wallet,eventId,raw.transactionHash,tokenId);
					return blockNumber;
				}

				case 'certificateCreated':{
					console.log(raw);
					const wallet = event?.events[0]?.value ?? event?.events[0];
					const eventId = event?.events[1]?.value ?? event?.events[1];
					await CertificateViewModel.syncCertificate(wallet.toLowerCase(),eventId,raw.transactionHash);
					return blockNumber;
				}
			
			}
		}
	} catch (e) {
		console.error('processMarketEventError', e);
	}
	return 0;
};

const reScanPastEvents = async () => {
	try {
		new CronJob('*/59 * * * * *', async function mytask() {
			const mydiscount = await marketInstance.GetContract().getCurrentDiscountPercentage();
			//			const activeSales = await marketInstance.GetContract().active_sales();
			await NFTSyncViewModel.saveCurrentDiscount(mydiscount);
			console.log('i will execute this task every 59 seconds... the discount is ' + mydiscount);
			//			console.log('Active Sales is' + activeSales);
			console.log(new Date());
		}).start();
		// new CronJob('*/5 * * * *',async function mytask() {
		// 	for(i = 0; i < 15 ; i++){
		// 		let precios = await marketInstance.GetContract().nft_prices(i);
		// 		console.log(i);
		// 		precios = +precios/1000000000000000000;
		// 		await NFTSyncViewModel.updatePrice(CommonViewModel.getItem(i) ,
		// 		CommonViewModel.getNftTypeById(i),precios);
		// 	}
		// }).start();

		new CronJob('0 */6 * * *', async () => {
			let now = new Date();
			checkOldBlocks = await marketInstance.GetBlockFromTime(Math.floor(new Date().setHours(now.getHours() - 72) / 1000));
			console.log('starting rescan from the block ' + checkOldBlocks);
			checkOldEvents('marketplacecheck', marketInstance, [
				'SuccessfulPurchase(uint256 indexed purchase_type,uint256 amount,uint256 price,uint256 amount_paid,address buyer)',
				'SetNftPrice(uint256 index, uint256 new_price)',
				'SuccessfulClaim(index_topic_1 uint256 claim_type, uint256 amount, address buyer, uint256[] tokenIds)'],
				processMarketEvent, checkOldBlocks);
		}).start();
	} catch (e) {
		console.log("an error has occurred " + e);
	}
}

/**
 * 
 * @deprecated deprecated because now Cursos, are the same events.
 */

const createCurso = async(cursoId)=>{
	try {
		const data = await certificateInstance.GetNewSignerContract(process.env.PRIVATE_WALLET_KEY).createEvent(cursoId)
		return await data.wait();
	} catch (error) {
		console.log(error)
		throw error;
	}
}

/**
 * 
 * @deprecated deprecated because now Front end mint the NFTS
 */

const mintNft = async(wallet,eventId,filename)=>{
	try {
		const data = await certificateInstance.GetNewSignerContract(process.env.PRIVATE_WALLET_KEY).safeMint(eventId,wallet,filename);
		return await data.wait()
	} catch (error) {
		console.log(error)
		throw error;
	}
}
exports.initilizeContractSyncronizers = initilizeContractSyncronizers;
exports.initContracts = initContracts;
// exports.createCurso = createCurso;
// exports.mintNft = mintNft;

