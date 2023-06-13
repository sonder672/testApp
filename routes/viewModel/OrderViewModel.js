const keystone = require('keystone');
const moment = require('moment');
const OrderModel = keystone.list('OrderModel');

const CacheViewModel = require('./CacheViewModel');
const ERRORS = require('./../utility/errors').ERRORS;
let OrderCache;

const internalGetOrderPopulated = async (data) => {
	try {
		let skip = data.skip;
		let limit = data.limit;
		const tokenId = data.tokenId;
		const state = data.state;
		const type = data.type;
		const elapsedHours = data.elapsedHours;

		if (!skip) {
			skip = 0;
		} else {
			skip = Number(skip);
		}
		if (!limit) {
			limit = 100;
		} else {
			limit = Number(limit);
		}

		limit = Math.max(-1, limit);
		limit = Math.min(500, limit);
		skip = Math.max(-1, skip);
		const query = {};

		let query_filter = 'POPULATE_ORDERS-' + limit + '-' + skip;
		if (tokenId) {
			query.tokenId = tokenId;
			query_filter += '-' + tokenId;
		} else {
			query_filter += '-0';
		}
		if (state) {
			query.state = state;
			query_filter += '-' + state;
		} else {
			query_filter += '-0';
		}
		if (type) {
			query.type = `${type}`.toUpperCase();
			query_filter += '-' + type;
		} else {
			query_filter += '-0';
		}

		if (!isNaN(elapsedHours)) {
			const time = new Date();
			if (state && state === 'DONE') {
				query.executedAt = { $gt: new Date(time.setHours(time.getHours() - Math.abs(Number(elapsedHours)))) };
			} else {
				query.createdAt = { $gt: new Date(time.setHours(time.getHours() - Math.abs(Number(elapsedHours)))) };
			}
			query_filter += '-' + elapsedHours;
		} else {
			query_filter += '-0';
		}
		if (!OrderCache) {
			OrderCache = await CacheViewModel.getModelCache('OrderModel');
		}

		let promise = OrderCache.find(
				query, {
					__v: 0,
					createdBy: 0,
					updatedBy: 0,
					__t: 0,
				}).populate('seller', '_id publicAddress').populate('buyer', '_id publicAddress').sort('-createdAt').cache(1, query_filter).lean();
		if (limit > 0) {
			promise = promise.limit(limit);
		}
		if (skip > 0) {
			promise = promise.skip(skip);
		}
		const characterNFTs = await promise.lean().exec();
		let count = await OrderModel.model.count(query);

		return {
			items: characterNFTs,
			count: count,
		};
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('OrderViewModel::getUserOrders', e);
		}
		throw e;
	}

};

const getOrdersByNftId = async (tokenId, limit, skip, state, type) => {

	try {
		return await internalGetOrderPopulated({
			tokenId: tokenId,
			limit: limit,
			skip: skip,
			state: state,
			type: type,
		});

	} catch (e) {
		if (e && !e.internalCode) {
			console.log('OrderViewModel::getUserOrders', e);
		}
		throw e;
	}
};

exports.getOrdersByNftId = getOrdersByNftId;

