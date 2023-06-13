const keystone = require('keystone');
const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
cachegoose(mongoose);

const { getValue, setValue } = require('mongoose/lib/utils');// require("./../../node_modules/mongoose/lib/utils");

/**
 * @method hydratePopulated
 * @param {Object} json
 * @return {Document}
 */
mongoose.Model.hydratePopulated = function (json) {
	const object = this.hydrate(json);
	
	for (const [path, type] of Object.entries(this.schema.singleNestedPaths)) {
		const { ref } = type.options;
		if (!ref) continue;
		
		const value = getValue(path, json);
		if (value == null || value instanceof mongoose.Types.ObjectId) continue;
		
		setValue(path, mongoose.model(ref).hydratePopulated(value), object);
	}
	
	return object;
};

const SCHEME_MAP = new Map();

const loadModels = async () => {
	try {
		let mongodb = keystone.get('mongo');
		
		const t = await mongoose.connect(mongodb, { useNewUrlParser: true });
		const modelsKeys = Object.keys(keystone.mongoose.modelSchemas);
		
		for (let i = 0; i < modelsKeys.length; i++) {
			const modelName = modelsKeys[i];
			
			try {
				const shcme = getSchemeFromModel(keystone.mongoose.modelSchemas[modelName].paths);
				// console.log(shcme)
				SCHEME_MAP.set(modelName, mongoose.model(modelName, new mongoose.Schema(shcme)));
			} catch (e) {
				if (modelName && modelName.path) {
					console.log('error cache', modelName.path);
				}
			}
		}
		// console.log(SCHEME_MAP)
		return true;
	} catch (e) {
		console.log(e);
	}
};

const getSchemeFromModel = (modelScheme) => {
	// console.log('getSchemeFromModel',modelScheme)
	const keysValue = Object.keys(modelScheme);
	const response = {};
	for (let i = 0; i < keysValue.length; i++) {
		try {
			const fieldName = keysValue[i];
			if (fieldName) {
				const item = modelScheme[fieldName];
				const type = item.instance;
				const res = {
					type: type,
				};
				if (type === 'ObjectID') {
					if (item.options && item.options.ref) {
						res.ref = item.options.ref;
					}
					res.type = mongoose.Schema.Types.ObjectId;
				}
				response[fieldName] = res;
			}
		} catch (e) {
			console.log(e);
		}
	}
	return response;
};

const getModelCache = async (name) => {
	if (SCHEME_MAP.size === 0) {
		await loadModels();
	}
	// console.log(SCHEME_MAP)
	return SCHEME_MAP.get(name);
};

const clearCacheKey = (cacheKey) => {
	cachegoose.clearCache(cacheKey);
};


exports.clearCacheKey = clearCacheKey;
exports.getModelCache = getModelCache;
