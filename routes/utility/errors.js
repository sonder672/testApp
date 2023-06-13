const ERRORS = {
	NOT_ALLOWED: { statusCode: 403, internalCode: 2001, message: 'Method not allowed, please login' },
	BALANCE_INTERNAL_INSUFFICIENT: {
		statusCode: 500,
		internalCode: 2002,
		message: 'Internal Game balance insufficient',
	},
	CRYPTO_BALANCE_INSUFFICIENT: { statusCode: 500, internalCode: 2003, message: 'Crypto balance insufficient' },
	INCORRECT_LOGIC_ACTION: {
		statusCode: 500,
		internalCode: 2004,
		message: 'The params are incorrect or exists some business error',
	},
	
	UNKNOWN_ERROR: { statusCode: 500, internalCode: 5000, message: 'An unknown error was occurred' },
	INVALID_PARAMS: { statusCode: 500, internalCode: 5001, message: 'Invalid params' },
	DUPLICATED_ITEM: { statusCode: 500, internalCode: 5003, message: 'The inserted item already exists' },
	ITEM_NOT_FOUND: { statusCode: 404, internalCode: 5004, message: 'The request item not found' },
	INVENTORY_INSUFFICIENT: { statusCode: 500, internalCode: 5005, message: 'The inventory resource are insufficient' },
};

const fixCodes = () => {
	
	let keys = Object.keys(ERRORS);
	for (let i = 0; i < keys.length; i++) {
		let k = keys[i];
		let t = ERRORS[k];
		if (t) {
			t.key = k;
		}
	}
	
};
fixCodes();
exports.ERRORS = ERRORS;
