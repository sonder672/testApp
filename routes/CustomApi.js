const errors = require('./utility/errors').ERRORS;

// The exported function returns a closure that retains
// a reference to the keystone instance, so it can be
// passed as middeware to the express app.

module.exports = function (req, res, next) {
	
	res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, DELETE, GET, HEAD');
	res.header('Access-Control-Allow-Origin', '*');
	// res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time,Authorization,Origin, X-Requested-With');
	
	res.apiErrorMine = function (key, err, msg, code) {
		
		if (key && key.internalCode) {
			res.status(key.statusCode);
			res.apiResponse(key);
		} else {
			res.status(500);
			res.apiResponse(errors.UNKNOWN_ERROR);
		}
	};
	if (/OPTIONS/i.test(req.method) || /HEAD/i.test(req.method)) {
		res.sendStatus(200);
	} else {
		next();
	}
	
};

