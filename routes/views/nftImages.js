const keystone = require('keystone');
const statics = require('./../utility/statics');
const path = require('path');
const fs = require('fs');
exports = module.exports = function (req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.section = 'images';
	const imageName = req.params.imageName;
	if (!imageName) {
		res.status(404);
		res.type('txt').send('404 - Not found', 404);
	} else {
		
		const fileName = path.resolve('./public/nft/' + imageName);
		res.setHeader('Access-Control-Expose-Headers', 'ETag');
		if (!fs.existsSync(fileName)) {
			res.status(404);
			res.type('txt').send('404 - Not found', 404);
		} else {
			res.setHeader('Cache-control', 'public, max-age=86400');
			res.setHeader('Content-Type', 'image/png');
			res.sendFile(fileName);
		}
		
	}
};
