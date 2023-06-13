const qrcode = require('qrcode');
const keystone = require('keystone');
const EventModel = keystone.list('EventModel');
const UserModel = keystone.list('UserModel');
const ParticipationModel = keystone.list('ParticipationModel');
const path = require('path')
const fs = require('fs');

const getEvent = async (req,res)=>{
    try {
        const data = await EventModel.model.find({eventId:req.params.id}).lean();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const getEventQr = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await EventModel.model.findOne({eventId:+eventId}).lean()
        if(!event)
            return res.status(404).json({message:"Event not found"});
            let p = path.join(__dirname+'../..')
            let p2 = path.join(p+'./..');
            let absolute = path.join(p2,"/public/uploads/qr/"+eventId+".png");
            const existsFolder = await fs.existsSync(path.join(p2,"/public/uploads/qr"))
            if(!existsFolder) {
               await fs.mkdirSync(path.join(p2,"/public/uploads/qr"));
            }
            if(fs.existsSync(absolute))
            return res.sendFile(absolute)
        await qrcode.toFile('public/uploads/qr/'+eventId+'.png',(process.env.FRONT_URL ?? 'https://caepoap.devmitsoftware.com/')+'/search?type=event&id='+eventId,{
            width:500
        },function(err){
            if(err)
            return res.status(500).json(err)
            return res.sendFile(absolute);
          });
          
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const assignUsertoEvent = async (req,res)=>{
    try {
        const {emailUser,eventId} = req.body;
        if(!emailUser || !eventId)
            return res.status(400).json({message:"Error Empty Fields",internalCode:1});
        const existsEvent = await EventModel.model.findOne({eventId:eventId}).lean();
        if(!existsEvent?._id)
            return res.status(400).json({message:"Event doesn\'t exists",internalCode:2});
       const exists = await ParticipationModel.model.findOne({$and:[{user:emailUser},{event:existsEvent._id}]}).lean()
       if(exists)
            return res.status(400).json({message:"User Already Registered",internalCode:3})
       const register = ParticipationModel.model({user:emailUser,event:existsEvent._id});
       const data = await register.save();
       return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getActualEvent = async (req,res) =>{
        try {
           const event = await EventModel.model.findOne({},{eventId:1}).sort('-createdAt').lean()
           return res.status(200).json({actualEventId:+event?.eventId ?? 0});
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
}

const isInEvent = async (req,res)=>{
	try {
		const {email,eventId} = req.body;
		if(!email || !eventId)
            return res.status(400).json({error:"Empty Fields"});
    const existsEvent = await EventModel.model.findOne({eventId:+eventId}).lean();
    if(!existsEvent)
        return res.status(400).json({error:"The Event doesnt Exist"});
    const exists = await ParticipationModel.model.findOne({$and:[{user:email},{event:existsEvent._id}]}).lean()
	return res.status(200).json({exists:exists?._id ? true : false});
} catch (error) {
		return res.status(500).json({Error:"Error Getting the Event "+error.message})
	}
}
exports.getEvent = getEvent;
exports.getEventQr = getEventQr;
exports.assignUsertoEvent = assignUsertoEvent;
exports.isInEvent = isInEvent;
exports.getActualEvent = getActualEvent;