const reader = require('xlsx')
const fs = require('fs');
const path = require('path')
const CertificateModel = require('keystone').list('CertificateModel')
const keystone = require('keystone');
const EventModel = keystone.list('EventModel');
const sharp = require('sharp');

const readExcel = function(uri, event) {
    try {
        if(!fs.existsSync(uri))
        throw new Error(`${uri} doesn't exists`)
        const file = reader.readFile(uri)
        const sheets = file.SheetNames;
        let arr = []
        for(let i = 0; i<sheets.length; i++){
             arr = reader.utils.sheet_to_json(file.Sheets[sheets[i]]);
        }

        const definitivePath = path.join(process.cwd(),`public/uploads/test/imagenes/${arr[0]['imagen']}`)
        arr.forEach((data) => {
                require('../viewModel/UserViewModel')
                    .getUserInfo(data.email)
                    .then((user) => {
                        if(!user) {
                            console.log('user doesnt exists')
                            return;
                        }
                    
                        EventModel.model.findById(event).lean()
                        .then(event => {
                            if(!event) {
                                console.log('event doesnt exists')
                                return;
                            }
                        
                            const options = { year: 'numeric', month: 'long', day: 'numeric' };
                            const eventDate = new Date(event.eventDate);
                            const formattedDate = eventDate.toLocaleDateString('es-ES', options);

                            const uniqueFileName = `${new Date().getTime()}${data.email}certificate.jpg`;
                            addDynamicTextToImage(definitivePath, user.fullName, event.eventName, formattedDate, uniqueFileName)
                                .then(outputImagePath => {
                                    const fileSize = fs.statSync(outputImagePath);

                                    CertificateModel.model.create({
                                        user: user._id,
                                        photo: {
                                            filename: uniqueFileName,
                                            size: fileSize.size,
                                            mimetype: 'image'
                                        },
                                        event: event
                                    })
                                .catch(error => {
                                    console.error('Error al agregar texto a la imagen:', error);
                                    return;
                                });
                                })
                        .catch(error => {
                        console.error(error);
                        });
                    }).catch((e)=>console.log(e))
                    })
        })
    } catch (error) {
        console.log(error);
    }
}

const addDynamicTextToImage = async function(imagePath, name, event, date, fileName) {
    try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();
        const { width, height } = metadata;

        const textPositionX = width * 0.5;
        const textPositionY = height * 0.5;
        const maxFontSize = Math.min(width, height) * 0.1 * 0.3;
  
        const modifiedImageBuffer = await image
            .resize(width, height)
            .composite([{
                input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
                    <text x="${textPositionX}" y="${textPositionY}" font-size="${maxFontSize}" fill="#000000" text-anchor="middle" dominant-baseline="middle">
                        <tspan x="${textPositionX}" dy="-0.6em" font-size="${maxFontSize * 2}">${name.toUpperCase()}</tspan>
                        <tspan x="${textPositionX}" dy="1.2em">participó del ${event} que se llevó a cabo de manera virtual</tspan>
                        <tspan x="${textPositionX}" dy="1.2em">el día ${date}</tspan>
                    </text>
                </svg>`),
                blend: 'over',
            },
            ])
            .toBuffer();

            const destinationPath = path.join(process.cwd(),`public/uploads/certificates/${fileName}`)
            await fs.promises.writeFile(destinationPath, modifiedImageBuffer);
            console.log("Agregada imagen exitosamente");

            return destinationPath;
    } catch (error) {
      console.error('Error al agregar texto a la imagen:', error);
      throw error;
    }
};

module.exports = {readExcel}