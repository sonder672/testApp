const NftPhotoModel = require('keystone').list('NftPhotoModel');
const UserViewModel = require('./../viewModel/UserViewModel');
const EventModel = require('keystone').list('EventModel');
const MintedNftModel = require('keystone').list('MintedNftModel');
const WalletModel = require('keystone').list('WalletModel');
const CertificateViewModel = require('./../viewModel/CertificateViewModel');
const { mintNft } = require('../bscscan/index');
const fs = require('fs');
const path = require('path')
const getAllNft = async (req, res) => {
	try {
		const info = await NFTViewModel.getNfts();
		return res.status(200).send(info);
	} catch (e) {
		if (e && !e.internalCode) {
			console.log('an error has ocurred', e);
		}
		return res.status(500).json({ error: e });
	}
};

const uploadNft = async (req, res) => {
	try {
		const { eventId, email } = req.body;
		const user = await UserViewModel.getUserInfo(email.toLowerCase());
		const event = await EventModel.model.findOne({ eventId: +eventId }).lean();
		if (!user || !event)
			return res.status(400).json({ error: "Event or User doesnt Exists" });
		req.files.user = user._id;
		req.files.event = event._id;
		req.files.transactionHash = "0x00000000000000000000000"
		const exists = await NftPhotoModel.model.findOne({ $and: [{ user: user._id }, { event: event }] }).lean()
		if (exists)
			return res.status(400).json({ exists: true })
		const nft = new NftPhotoModel.model();
		nft.getUpdateHandler(req).process(req.files, { fields: 'user,event,transactionHash,photo' }, function (err) {
			if (err) return res.status(500).json({ err });

			res.status(200).json({
				image_upload: nft
			});

		});
	} catch (error) {
		console.log(error)
		return res.status(400).json(error)
	}
}

const getImage = async (req, res) => {
	const { userEmail, eventId } = req.body
	try {
		const user = await UserViewModel.getUserInfo(userEmail.toLowerCase());
		const event = await EventModel.model.findOne({ eventId: +eventId }).lean();
		if (!user || !event)
			return res.status(400).json({ error: "Event or User doesnt Exists" });
		const exists = await NftPhotoModel.model.findOne({ $and: [{ user: user._id }, { event: event }] }).populate('event').lean()
		if (exists)
			return res.status(200).json(exists)
		return res.status(404).json({ message: "Image Not Found" });
	} catch (error) {
		return res.status(404).json({ message: "Error" });
	}
}


const getPhotoUrl = async (req, res) => {
	try {
		const { eventId, email } = req.query;
		if (!email || !eventId)
			return res.status(400).json({ message: "Empty Fields" })
		const user = await UserViewModel.getUserInfo(email.toLowerCase());
		const event = await EventModel.model.findOne({ eventId: +eventId }).lean();
		if (!user || !event)
			return res.status(400).json({ error: "Event or User doesnt Exists" });
		const exists = await NftPhotoModel.model.findOne({ $and: [{ user: user._id }, { event: event }] }).populate('event').lean()
		if (exists)
			return res.status(200).json({
				description: exists.event.eventName,
				external_url: "",
				image: `https://apicace.devmitsoftware.com/public/uploads/` + exists.photo.filename,
				name: exists.event.eventName,
				attributes: []
			})
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const getPhotoUrlById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id)
			return res.status(400).json({ message: "Empty Fields" })
		const exists = await MintedNftModel.model.findOne({ NftId: +id }).populate('photo').populate('photo.event').lean();
		const eventData = await EventModel.model.findOne({ _id: exists.photo.event }).lean()
		if (exists)
			return res.status(200).json({
				description: eventData.eventName,
				external_url: "",
				image: process.env.BASE_URL+'/uploads/'+ exists.photo.photo.filename,
				name: eventData.eventName,
				attributes: []
			})
		return res.status(400).json({ message: 'Not Found' })
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const getCertificateUrlById = async (req, res) => {
	try {
		const { wallet, event } = req.query;
		if (!wallet || !event || Number.isNaN(event))
			return res.status(400).json({ message: "Empty Fields" })
		const data = await CertificateViewModel.getCertificateData(wallet.toLowerCase(),+event)
		if (data)
			return res.status(200).json({
				description: data.event.eventName,
				external_url: "",
				image: data.url,
				name: data.event.eventName,
				attributes: []
			})
		return res.status(400).json({ message: 'Not Found' })
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const getAllUserNft = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email)
			return res.status(400).json({ message: 'Empty Email Address' });
		const user = await UserViewModel.getUserInfo(email)
		if (!user)
			return res.status(400).json({ message: 'Empty Email Address' });
		const data = await NftPhotoModel.model.find({ user: user }).populate('event').lean()
		return res.status(200).json(data)
	} catch (error) {
		return res.status(500).json({ error: error?.message ?? e });
	}
}

const getUserCertificates = async (req, res) => {
	try {
		const { email } = req.params;
		if (!email)
			return res.status(400).json({ message: 'Empty fields', internalCode: 1 })
		const data = await CertificateViewModel.getUserCertificates(email);
		if(data?.Certificates?.length < 1)
			delete data.Certificates
		return res.json(data)
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
/**
 * 
 @deprecated this function was deprecated because now the Nfts are minted in the Frontend.
 */
const mintCertificate = (req, res) => {
	const { event, email, wallet, url } = req.body;
	if(!event || !email || !wallet || !url)
		return res.status(400).json({ message: 'Empty fields', internalCode: 1 })
	WalletModel.model.aggregate([
		{
			$match: {
				wallet: {
					$regex: wallet, $options: 'i'
				}
			}
		}, {
			$lookup:{
				from:"usermodels",
				localField:"user",
				foreignField:"_id",
				as:"user"
			}
		},{
			$unwind:{
				path:"$user",
				preserveNullAndEmptyArrays:true
			}
		}
	]).exec((err,data)=>{
		if(err)
			return res.status(400).json({err:err.message});
		console.log(data)
		if(data[0]){
			if(data[0].user.email == email){

			}else{
				return res.status(400).json({message:"Wallet and Email doesnt match", internalCode:3});
			}
		}else{
			UserViewModel.walletAssign(wallet.toLowerCase(),email)
			.then((data)=>{
				// mintear
				mintNft(wallet,course.eventId,filename).then((tx)=>{
					return res.json({message:'wallet assigned',data, tx})
				})
			}).catch(err=> res.status(500).json({err:err.message}));
		}
	
		
	}).catch((e)=>res.status(500).json({error:e?.message}));
}

const downloadCertificate = (req, res) => {
	try {
		const {filename} = req.params;
		const p = path.join(process.cwd(),'./public/uploads/certificates/',filename);
		if(fs.existsSync(p)){
			res.sendFile(p)
		}
		else
		return res.status(404).json({message:'does not exist'});
	} catch (error) {
		return res.status(500).json({message:error.message});
	}
}


exports.getAllNft = getAllNft;
exports.uploadNft = uploadNft;
exports.getImage = getImage;
exports.getPhotoUrl = getPhotoUrl;
exports.getPhotoUrlById = getPhotoUrlById;
exports.getAllUserNft = getAllUserNft;
exports.getUserCertificates = getUserCertificates;
// exports.mintCertificate = mintCertificate;
exports.downloadCertificate = downloadCertificate;
exports.getCertificateUrlById = getCertificateUrlById;