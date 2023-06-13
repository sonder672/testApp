const reader = require('xlsx')
const fs = require('fs');
const path = require('path')
const CertificateModel = require('keystone').list('CertificateModel')
const readExcel = function(uri,event){
    try {
        if(!fs.existsSync(uri))
        throw new Error(`${uri} doesn't exists`)
        const file = reader.readFile(uri)
        const sheets = file.SheetNames;
        let arr = []
        for(let i = 0; i<sheets.length; i++){
             arr = reader.utils.sheet_to_json(file.Sheets[sheets[i]]);
        }
        const timestamp = new Date().getTime()
        arr.forEach((data)=>{
            const pathFile = data.imagen;
            const definitivePath = path.join(process.cwd(),`public/uploads/test/imagenes/${pathFile}`)
            const destinationPath = path.join(process.cwd(),`public/uploads/certificates/${timestamp+pathFile}`)
            fs.copyFile(definitivePath,destinationPath,(err)=>{
                if(err){
                    console.log(err.message)
                    return
                }
                require('../viewModel/UserViewModel').getUserInfo(data.email).then((user)=>{
                    if(!user){
                        console.log('user doesnt exists')
                        return;
                    }
                    const filesize = fs.statSync(destinationPath)
                    CertificateModel.model.create({
                        user:user._id,
                        photo:{
                            filename:timestamp+pathFile,
                            size:filesize.size,
                            mimetype:'image'
                        },
                        event:event
                    })
                }).catch((e)=>console.log(e))
            })
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {readExcel}