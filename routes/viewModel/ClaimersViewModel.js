var keystone = require('keystone');
let ClaimersSGModel = keystone.list('ClaimersModel');
let ClaimersLiquidModel = keystone.list('ClaimersLiquidModel');

const getAllMyClaims = async (user)=>{
    try {
        let obj = [];
        obj[0] = await ClaimersSGModel.model.findOne({user:{$regex:user,$options:'i'}}).lean();
        obj[1] = await ClaimersLiquidModel.model.findOne({user:{$regex:user,$options:'i'}}).lean();
        
       obj = obj.map((item)=>{
            let NFTS = []
            let p = 0;
            if(item.sgType1){
                NFTS[p] = {modelId:1,quantity:item.sgType1}
                p++;           
            }
            if(item.sgType2){
                NFTS[p]= {modelId:2,quantity:item.sgType2}   
                p++;
            }
            if(item.sgType3){
                NFTS[p] = {modelId:3,quantity:item.sgType3}   
                p++;
            } 
            if(item.sgType4){
                NFTS[p] = {modelId:4,quantity:item.sgType4}   
                p++;
            }
            if(item.sgType5){
                NFTS[p] = {modelId:5,quantity:item.sgType5}  
                p++; 
            }
            if(item.LiquidType1){
                NFTS[p] = {modelId:1,quantity:item.LiquidType1}  
                p++;
            } 
            if(item.LiquidType2){
                NFTS[p] = {modelId:2,quantity:item.LiquidType2}  
                p++;
            }
            if(item.LiquidType3){
                NFTS[p]= {modelId:3,quantity:item.LiquidType3}   
                p++;
            } 
            if(item.LiquidType4){
                NFTS[p] = {modelId:4,quantity:item.LiquidType4}  
                p++;
            }
            if(item.LiquidType5){
                NFTS[p] = {modelId:5,quantity:item.LiquidType5}  
                p++;
            }
            return [...NFTS]
        })

        return obj;
    } catch (error) {
        console.log(error)
    }
}

exports.getAllMyClaims = getAllMyClaims;