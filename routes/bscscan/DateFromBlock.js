const moment = require('moment');
const axios = require('axios');
const statics = require('./../utility/statics');
const bounds = require('binary-search-bounds');
const MIN_RANGE = 20 * 60 * 5;
const UPDATE_LAST_BLOCK = 60 * 15;
const DATA_ARRAY = [];
let lastBlock = false;
let lastDate = false;

const GetTimeFromBlockNumber = async (blockNumber, ignore) => {
	try {
		if (ignore) {
			return moment().utc();
		}
		
		let now = new Date();
		now.setSeconds(now.getSeconds() - 10);
		let nesLastDate = Math.floor(now.getTime() / 1000);
		if (!lastBlock || !lastDate || Math.abs(nesLastDate - lastDate) > UPDATE_LAST_BLOCK) {
			
			lastBlock = await getLastBlock(nesLastDate);
			lastDate = nesLastDate;
			const date = await fetchDateTimeFromBlockNumber(lastBlock);
			if (date) {
				DATA_ARRAY.push({
					block: lastBlock,
					date: date,
				});
			}
		}
		
		
		if (!DATA_ARRAY.length) {
			const date = await fetchDateTimeFromBlockNumber(blockNumber);
			if (date) {
				DATA_ARRAY.push({
					block: blockNumber,
					date: date,
				});
				return date;
			}
		}
		
		let gretterIndex = bounds.ge(DATA_ARRAY, { block: blockNumber }, internalByBlock);
		let lowerIndex = bounds.le(DATA_ARRAY, { block: blockNumber }, internalByBlock);
		let nearData;
		if (gretterIndex < DATA_ARRAY.length && gretterIndex >= 0) {
			nearData = DATA_ARRAY[gretterIndex];
		}
		
		if (lowerIndex < DATA_ARRAY.length && lowerIndex >= 0) {
			let lowerData = DATA_ARRAY[lowerIndex];
			if (!nearData || Math.abs(lowerData.block - blockNumber) < Math.abs(nearData.block - blockNumber)) {
				nearData = lowerData;
			}
		}
		if (!nearData || Math.abs(nearData.block - blockNumber) > MIN_RANGE) {
			const date = await fetchDateTimeFromBlockNumber(blockNumber);
			if (date) {
				DATA_ARRAY.push({
					block: blockNumber,
					date: date,
				});
				DATA_ARRAY.sort(internalByBlock);
				return date;
			}
			return moment().utc();
		} else {
			const blockDiff = blockNumber - nearData.block;
			const secondDiff = Math.abs(blockDiff) * 3;
			if (blockDiff === 0) {
				return moment(nearData.date);
			} else if (blockDiff > 0) {
				return moment(nearData.date).add(secondDiff, 'seconds');
			} else if (blockDiff < 0) {
				return moment(nearData.date).subtract(secondDiff, 'seconds');
			}
		}
		/*
		if (lowerIndex === -1) {
			const date = await fetchDateTimeFromBlockNumber(blockNumber);
			if (date) {
				DATA_ARRAY.push({
					block: blockNumber,
					date: date,
				});
				return date;
			}
		}
		const lower = DATA_ARRAY[lowerIndex];
		if (gretterIndex === -1 && Math.abs(lower.block - blockNumber) < MIN_RANGE) {
			const _diffBlock = blockNumber - lower.block;
			return moment(lower.date).add(Math.floor(_diffBlock * 3), 'seconds');
		}
		if (Math.abs(lower.block - blockNumber) > MIN_RANGE) {
			const date = await fetchDateTimeFromBlockNumber(blockNumber);
			if (date) {
				DATA_ARRAY.push({
					block: blockNumber,
					date: date,
				});
				return date;
			}
		}
		if (gretterIndex === -1 || gretterIndex === DATA_ARRAY.length) {
			const date = await fetchDateTimeFromBlockNumber(blockNumber);
			if (date) {
				DATA_ARRAY.push({
					block: blockNumber,
					date: date,
				});
				return date;
			}
		}
		const gretter = DATA_ARRAY[gretterIndex];
		if (Math.abs(gretter.block - blockNumber) > MIN_RANGE) {
			const date = await fetchDateTimeFromBlockNumber(blockNumber);
			if (date) {
				DATA_ARRAY.push({
					block: blockNumber,
					date: date,
				});
				return date;
			}
		}
		
		
		const diffTotal = gretter.block - lower.block;
		const seconds = moment(gretter.date).diff(moment(lower.date), 'seconds');
		const percent = (blockNumber - lower.block) / diffTotal;
		return moment(lower.date).add(Math.floor(seconds * percent), 'seconds');
		
		 */
	} catch (e) {
		console.log('GetTimeFromBlockNumber', e);
	}
};

const internalByBlock = (a, b) => {
	if (a.block > b.block) {
		return 1;
	} else if (a.block < b.block) {
		return -1;
	}
	return 0;
};


/*
*
* https://api.bscscan.com/api
   ?module=block
   &action=getblockreward
   &blockno=2170000
   &apikey=YourApiKeyToken
* */
const fetchDateTimeFromBlockNumber = async (blockNumber) => {
	try {
		let result = false;
		for (let i = 0; i < 10 && !result; i++) {
			try {
				let response = await axios.get(process.env.BSC_API_PATH + 'api?'
						+ 'module=block'
						+ '&action=getblockreward'
						+ '&blockno=' + blockNumber
						+ '&apikey=' + process.env.BSC_API_KEY);
				if (response && response.data && response.data.result && response.data.result.timeStamp) {
					result = moment.utc(Number(response.data.result.timeStamp) * 1000);
				}
				if (!result) {
					await statics.waitFor(200);
				}
			} catch (e) {
				console.log('fail getblockreward');
			}
		}
		// console.log('fetch', blockNumber);
		return result;
	} catch (e) {
		console.log('fetchDateTimeFromBlockNumber', e);
	}
	return null;
	
};
const getLastBlock = async (timestamp) => {
	try {
		
		let result = false;
		for (let i = 0; i < 10 && !result; i++) {
			try {
				let response = await axios.get(process.env.BSC_API_PATH + 'api?'
						+ 'module=block'
						+ '&action=getblocknobytime'
						+ '&timestamp=' + timestamp
						+ '&closest=before'
						+ '&apikey=' + process.env.BSC_API_KEY);
				if (response && response.data && response.data.result) {
					result = Number(response.data.result);
				}
				if (!result) {
					await statics.waitFor(200);
				}
			} catch (e) {
				console.log('fail getblockreward');
			}
		}
		return result;
	} catch (e) {
		console.log('getLastBlock', e);
	}
	return null;
	
};
exports.test = async () => {
	const blocks = [
		{
			block: 16861095,
			date: 'Feb-18-2022 11:32:30 AM',
		},
		{
			block: 16874695,
			date: 'Feb-18-2022 10:52:30 PM',
		},
		{
			block: 16874095,
			date: 'Feb-18-2022 10:22:30 PM',
		},
		{
			block: 16851095,
			date: 'Feb-18-2022 03:12:30 AM',
		},
		{
			block: 16835095,
			date: 'Feb-17-2022 01:52:30 PM',
		},
		{
			block: 16871095,
			date: 'Feb-18-2022 07:52:30 PM',
		},
		{
			block: 16825095,
			date: 'Feb-17-2022 05:32:04 AM',
		},
		{
			block: 16861095,
			date: 'Feb-18-2022 11:32:30 AM',
		},
		{
			block: 16820095,
			date: 'Feb-17-2022 01:21:21 AM',
		},
		{
			block: 16815095,
			date: 'Feb-16-2022 09:11:21 PM',
		},
		{
			block: 16815471,
			date: 'Feb-16-2022 09:30:09 PM',
		},
		{
			block: 16810471,
			date: 'Feb-16-2022 05:20:09 PM',
		},
		{
			block: 16830471,
			date: 'Feb-17-2022 10:01:18 AM',
		},
		{
			block: 16835471,
			date: 'Feb-17-2022 02:11:18 PM',
		},
	];
	
	blocks.sort(internalByBlock);
	for (let i = 0; i < blocks.length; i++) {
		const item = blocks[i];
		console.log('a', item.block);
		const result = moment(await GetTimeFromBlockNumber(item.block)).utc();
		
		console.log(item.date);
		console.log(result.format('MMM-DD-YYYY hh:mm:ss a'));
	}
};
exports.GetTimeFromBlockNumber = GetTimeFromBlockNumber;

