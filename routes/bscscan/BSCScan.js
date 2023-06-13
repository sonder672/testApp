const axios = require('axios');
const ethers = require('ethers');
const statics = require('./../utility/statics');

module.exports.BSCScan = class BSCScan {
	abiDecoder;
	contractAddress;
	bscApiBasePath;
	pathJson;
	contractJsonInfo;
	webSocketProvider = null;
	tokenContract = null;
	onContractReady;
	customHttpProvider;
	
	constructor (_pathJson, _contractAddress, _bscApiBasePath, _onContractReady) {
		this.pathJson = _pathJson;
		this.contractAddress = _contractAddress.toLowerCase();
		this.contractJsonInfo = require(this.pathJson);
		this.abiDecoder = require('abi-decoder');
		this.abiDecoder.addABI(this.contractJsonInfo.abi);
		this.bscApiBasePath = _bscApiBasePath;
		
		this.KEEP_ALIVE_CHECK_INTERVAL = 5000;
		this.keepAliveInterval = undefined;
		this.pingTimeout = undefined;
		this.onContractReady = _onContractReady;
	}
	
	GetContractAddress () {
		return this.contractAddress.toLowerCase();
	}
	
	GetSignerContract (privateKey) {
		try {
			if (!this.customHttpProvider) {
				this.customHttpProvider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_PROVIDER);
			}
			if (!this.tokenContract) {
				const signer = new ethers.Wallet(privateKey, this.customHttpProvider);
				this.tokenContract = new ethers.Contract(this.contractAddress, this.contractJsonInfo.abi, signer);
			}
			return this.tokenContract;
		} catch (e) {
			console.log(e);
		}
	}
	GetNewSignerContract (privateKey) {
		try {
			if (!this.customHttpProvider) {
				this.customHttpProvider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_PROVIDER);
			}
		
				const signer = new ethers.Wallet(privateKey, this.customHttpProvider);
				this.tokenContract = new ethers.Contract(this.contractAddress, this.contractJsonInfo.abi, signer);
			
			return this.tokenContract;
		} catch (e) {
			console.log(e);
		}
	}
	
	/**
	 * Triggered when provider's websocket is open.
	 */
	onWsOpen (event) {
		console.log('Connected to the WS!');
		this.keepAliveInterval = setInterval(() => {
			
			if (//0 conecting 1 open
					this.webSocketProvider._websocket.readyState === 0 ||
					this.webSocketProvider._websocket.readyState === 1
			) {
				return;
			}
			
			this.webSocketProvider._websocket.close();
		}, this.KEEP_ALIVE_CHECK_INTERVAL);
		
		if (this.defWsOpen) this.defWsOpen(event);
		if (this.onContractReady) {
			this.onContractReady();
		}
	}
	
	/**
	 * Triggered on websocket termination.
	 * Tries to reconnect again.
	 */
	onWsClose (event) {
		console.log('WS connection lost! Reconnecting...');
		this.webSocketProvider = null;
		this.tokenContract = null;
		clearInterval(this.keepAliveInterval);
		this.GetContract();
		
		if (this.defWsClose) this.defWsClose(event);
	}
	
	GetProvider () {
		return this.webSocketProvider;
	}
	
	async GetLogs (topic, fromBlock, toBlock) {
		let now = new Date();
		now.setSeconds(now.getSeconds() + 5);
		let lastBlock;
		const lastExecutedBlock = await this.GetBlockFromTime(Math.floor(now.getTime() / 1000));
		if (toBlock) {
			lastBlock = toBlock;
		} else {
			lastBlock = lastExecutedBlock;
			if (Math.abs(lastBlock - fromBlock)) {
				fromBlock = Math.max((process.env.INITIAL_BLOCK || 13857760), fromBlock);//await this.GetBlockFromTime(Math.floor(new Date('10/10/2021').getTime() / 1000));
			}
		}
		const result = { events: [], decoded: [] };
		
		for (let i = fromBlock; i < lastBlock; i += 999) {
			let end = i + 1000;
			if (end >= lastExecutedBlock) {
				end = 'latest';
			}
			if (i >= lastBlock) {
				return result;
			}
			try {
				const temp = await this.internalLogs(topic, i, end);
				if (temp.events.length) {
					result.events = result.events.concat(temp.events);
					result.decoded = result.decoded.concat(temp.decoded);
					await statics.waitFor(100);
					// console.log('reading', i);
				} else {
					await statics.waitFor(100);
				}
			} catch (e) {
				await statics.waitFor(200);
				console.log('reading fail', i, end, 'limit', lastBlock);
				if(e?.error?.message.includes('block range is too wide'))
					continue;
				i -= 999;
			}
		}
		return result;
	}
	
	async internalLogs (topic, fromBlock, endBlock) {
		let filter = {
			address: this.contractAddress,
			fromBlock: fromBlock,
			toBlock: endBlock,
		};
		if (Array.isArray(topic)) {
			for (let i = 0; i < topic.length; i++) {
				if (i > 0) {
					//topic0_1_opr=and
					// filter['topic' + (i - 1) + '_' + i + '_opr'] = 'or';
				}
				
				filter['topic' + i] = topic[i];
			}
			for (let i = 0; i < (topic.length - 1); i++) {
				for (let j = i + 1; j < topic.length; j++) {
					filter['topic' + i + '_' + j + '_opr'] = 'or';
				}
			}
			//filter.topics = topic;
		} else {
			filter.topics = [topic];
		}
		const events = await this.customHttpProvider.getLogs(filter);
		//const tt =  this.abiDecoder.decodeLogs(events)
		// if(events) {
		// 	for (let i = 0; i < events.length; i++) {
		// 		const currentEvent = events[i];
		// 		currentEvent.decoded = this.abiDecoder.decodeLogs(currentEvent.data)
		// 	}
		// }
		return { events: events, decoded: this.abiDecoder.decodeLogs(events) };
	}
	
	ResetEventsBlock (resetEvent) {
		if (!this.customHttpProvider) {
			this.GetContract();
		}
		this.customHttpProvider.resetEventsBlock(resetEvent);	
	}
	
	GetContract () {
		try {
			if (!this.customHttpProvider) {
				this.customHttpProvider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_PROVIDER);
			}
			if (!this.tokenContract) {
				this.tokenContract = new ethers.Contract(this.contractAddress, this.contractJsonInfo.abi, this.customHttpProvider);
			}
			return this.tokenContract;
		} catch (e) {
			console.log(e);
		}
	}
	
	async GetTokens (address, startblock, endblock) {
		try {
			if (!startblock || isNaN(startblock)) {
				startblock = 0;
			}
			
			if (!endblock || isNaN(endblock)) {
				endblock = 999999999;
			}
			if (!address) {
				address = this.contractAddress;
			}
			let tokens = await axios.get(this.bscApiBasePath + 'api?' +
					'module=account' +
					'&action=tokennfttx' +
					'&contractaddress=' + this.contractAddress +
					'&address=' + address +
					'&page=1' +
					'&offset=0' +
					'&startblock=' + startblock +
					'&endblock=' + endblock +
					'&sort=asc' +
					'&apikey=' + process.env.BSC_API_KEY);
			
			if (tokens && tokens.data && tokens.data.result) {
				return tokens.data.result;
			} else {
				return [];
			}
			
		} catch (e) {
			if (!e.code || (e.code !== 'ENOTFOUND' && e.code !== 'ETIMEDOUT')) {
				console.log('BSCScan::GetTokens', e);
			}
			throw e;
		}
	};
	
	async GetLogsBsc (address, topic, startblock, endblock) {
		try {
			if (!startblock || isNaN(startblock)) {
				startblock = 0;
			}
			
			if (!endblock || isNaN(endblock)) {
				endblock = 999999999;
			}
			if (!address) {
				address = this.contractAddress;
			}
			let tokens = await axios.get(this.bscApiBasePath + 'api?' +
					'module=logs' +
					'&action=getLogs' +
					//'&contractaddress=' + this.contractAddress +
					'&address=' + address +
					'&topic0=' + topic +
					'&fromBlock=' + startblock +
					'&toBlock=' + endblock +
					'&sort=asc' +
					'&apikey=' + process.env.BSC_API_KEY);
			
			// https://api.bscscan.com/api
			// 				?module=logs
			// 		&action=getLogs
			// 		&fromBlock=4993830
			// 		&toBlock=4993832
			// 		&address=0xe561479bebee0e606c19bb1973fc4761613e3c42
			// 		&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
			// 		&topic0_1_opr=and
			// 		&topic1=0x000000000000000000000000730e2065b9daee84c3003c05bf6d2b3a08e55667
			// 		&apikey=YourApiKeyToken
			if (tokens && tokens.data && tokens.data.result) {
				return { events: tokens.data.result, decoded: this.abiDecoder.decodeLogs(tokens.data.result) };
			} else {
				return { events: [], decoded: [] };
			}
			
		} catch (e) {
			if (!e.code || (e.code !== 'ENOTFOUND' && e.code !== 'ETIMEDOUT')) {
				console.log('BSCScan::GetTokens', e);
			}
			throw e;
		}
	};
	
	async GetTransactions (address, startblock, endblock) {
		try {
			if (!startblock || isNaN(startblock)) {
				startblock = 0;
			}
			
			if (!endblock || isNaN(endblock)) {
				endblock = 999999999;
			}
			if (!address) {
				address = this.contractAddress;
			}
			let transactions = await axios.get(this.bscApiBasePath + 'api?' +
					'module=account' +
					'&action=txlist' +
					'&address=' + address +
					'&page=1' +
					'&offset=0' +
					'&startblock=' + startblock +
					'&endblock=' + endblock +
					'&sort=asc' +
					'&apikey=' + process.env.BSC_API_KEY);
			if (transactions && transactions.data && transactions.data.result) {
				
				const result = [];
				for (let i = 0; i < transactions.data.result.length; i++) {
					const item = transactions.data.result[i];
					if (item.input) {
						item.decoded = this.abiDecoder.decodeMethod(item.input);
						delete item.input;
						//console.log(JSON.stringify(item));
					}
					result.push(item);
				}
				return result;
			} else {
				return [];
			}
			
		} catch (e) {
			if (!e.code || (e.code !== 'ENOTFOUND' && e.code !== 'ETIMEDOUT' && e.code !== 'ECONNRESET')) {
				//console.log('BSCScan::GetTransactions', e);
			}
			throw 'BSCScan::GetTransactions exception';
		}
	};
	
	async GetBlockFromTime (timestamp) {
		try {
			let result = 0;
			let exc;
			for (let i = 0; i < 50 && !result; i++) {
				try {
					
					let transactions = await axios.get(this.bscApiBasePath + 'api?' +
							'module=block' +
							'&action=getblocknobytime' +
							'&timestamp=' + timestamp +
							'&closest=before' +
							'&apikey=' + process.env.BSC_API_KEY);
					
					/*
					* https://api.bscscan.com/api
		   ?module=block
		   &action=getblocknobytime
		   &timestamp=1601510400
		   &closest=before
		   &apikey=YourApiKeyToken
					*
					* */
					
					if (transactions && transactions.data && transactions.data.result) {
						result = Number(transactions.data.result);
					}
				} catch (e) {
					exc = e;
					await statics.waitFor(500);
				}
			}
			if (!result && exc) {
				throw exc;
			}
			return result;
			
		} catch (e) {
			if (!e.code || (e.code !== 'ENOTFOUND' && e.code !== 'ETIMEDOUT')) {
				//console.log('BSCScan::GetBlockFromTime', e);
			}
			throw 'GetBlockFromTime error';
		}
	};
};
