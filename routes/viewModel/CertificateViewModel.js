const keystone = require('keystone');
const { ERRORS } = require('../utility/errors');
const CertificateModel = keystone.list('CertificateModel');
const UserModel = keystone.list('UserModel');
const WalletModel = keystone.list('WalletModel');
const EventModel = keystone.list('EventModel');

const getUserCertificates = async (email)=>{
    try {
       const data = await UserModel.model.aggregate([
            {
                $match:{
                    email:{
                        $regex:email , $options:'i'
                    }
                }
            },{
                $lookup:{
                    from:'walletmodels',
                    localField:'_id',
                    foreignField:'user',
                    as:'Wallet'
                }
            },
            {
                $lookup:{
                    from:'certificatemodels',
                    localField:'_id',
                    foreignField:'user',
                    as:'Certificates'
                }
            }
            ,{
                $lookup:{
                    from:'eventmodels',
                    localField:'Certificates.event',
                    foreignField:'_id',
                    as:'Evento'
                }
            },
            {
                $unwind:{
                    path:'$Wallet',
                    preserveNullAndEmptyArrays: true
                }
            },    {$addFields : {Results: 
                {$map : {
                    input : "$Certificates", 
                    as : "c", 
                    in : {$mergeObjects: [
                        "$$c",
                        {$arrayElemAt :[{$filter : {input : "$Evento",as : "ev", cond : {$eq :["$$c.event", "$$ev._id"]}}},0]}
                        ]
                    }}}
            }}
            ,   {
                $project:{
                        email:1,
                        fullName:1,
                        'wallet':'$Wallet.wallet',
                        'Certificates':'$Results'
                }
            }
        ])

        return data;
    } catch (error) {
        throw ERRORS.UNKNOWN_ERROR;
    }
}

const syncCertificate = async (wallet,event,tx)=>{
    try {
        const data = await WalletModel.model.findOne({wallet:{$regex:wallet ,$options:'i'}}).lean();
        const eventId = await EventModel.model.findOne({eventId:+event}).lean()
        if(data && eventId)
            await CertificateModel.model.updateOne({$and:[{user:data.user},{event:eventId}]},{$set:{transactionHash:tx}})        
    } catch (error) {
        console.log(error)
    }
}

const getCertificateData = async (wallet,eventId)=>{
    try {
        const walletData = await WalletModel.model.findOne({wallet:wallet}).lean()
        const event = await EventModel.model.findOne({eventId:eventId}).lean()
        return await CertificateModel.model.findOne({$and:[{user:walletData.user},{event:event}]}).populate('event').lean()
    } catch (error) {
        const e = error.statusCode ? error : ERRORS.UNKNOWN_ERROR;
        e.message = error.message
        throw e;
    }
}


exports.getUserCertificates = getUserCertificates;
exports.syncCertificate = syncCertificate;
exports.getCertificateData = getCertificateData;