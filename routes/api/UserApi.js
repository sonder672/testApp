const UserViewModel = require('./../viewModel/UserViewModel');

const getUserInfo = async (req, res) => {
	try {
		const info = await UserViewModel.getUserInfo(req.user);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserApi:getUserInfo', e);
		}
		return res.apiErrorMine(e);
	}
};
const setUserInfo = async (req, res) => {
	try {
		const data = (req.method === 'POST') ? req.body : req.query;
		const info = await UserViewModel.setUserInfo(req.user, data);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserApi:setUserInfo', e);
		}
		return res.apiErrorMine(e);
	}
};
const checkUserPhoneCode = async (req, res) => {
	try {
		const data = (req.method === 'POST') ? req.body : req.query;
		const info = await UserViewModel.checkUserPhoneCode(req.user, data.phoneCode);
		return res.apiResponse(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('UserApi:checkUserPhoneCode', e);
		}
		return res.apiErrorMine(e);
	}
};

const registerUser = (req, res) => {
	const { email, dni, fullName, business } = req.body;
	if (!email || !dni || !fullName || !business)
		return res.status(400).json({ message: "Empty Field(s)", internalCode:1 });
	UserViewModel.registerUser(req.body)
		.then((data) => res.status(201).json(data))
		.catch(err => res.status(500).json({err:err.message, internalCode:4}));
}

const existUser = (req, res) => {
	const { email } = req.body;
	if (!email)
		return res.status(400).json({ error: "Empty email", internalCode:1 });
			UserViewModel.getUserInfo(email).then((user) => {
				if(user)
					return res.status(200).json({exists:true,user})
				return res.status(200).json({exists:false})
			})
				.catch(e => res.status(500).json(e));
}

const walletExists = async (req, res) =>{
	try {
		const {wallet,email} = req.query;
		if(!wallet || !email)
			return res.status(400).json({message:"Empty Fields", internalCode:1});
		const exists = await UserViewModel.existsWallet(wallet.toLowerCase(),email);
		return res.json(exists);
	} catch (error) {
		return res.status(500).json({error:error?.message})
	}
}

const walletAssign = async (req, res) =>{
	try {
		const {wallet,email} = req.body;
		if(!wallet || !email)
			return res.status(400).json({message:"Empty Field", internalCode:1});
		const data = await UserViewModel.walletAssign(wallet.toLowerCase(),email);
		return res.json(data);
	} catch (error) {
		return res.status(500).json(error)
	}
}

exports.getUserInfo = getUserInfo;
exports.setUserInfo = setUserInfo;
exports.checkUserPhoneCode = checkUserPhoneCode;
exports.registerUser = registerUser;
exports.existUser = existUser;
exports.walletExists = walletExists;
exports.walletAssign = walletAssign;