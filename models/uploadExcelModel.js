const keystone = require('keystone');
const Types = keystone.Field.Types;
const decompress = require('decompress');
const excel = require('../routes/utility/readExcel');
const path = require('path')

const uploadExcelModel = new keystone.List('uploadExcelModel', {
    track: { createdAt: true },
    defaultSort: '-createdAt',
    schema: {
        usePushEach: true,
    },
    label: 'Archivos',
    map: { name: '_id' },
    nocreate: false,
    noedit: true,
    nodelete: false
});

const storage = new keystone.Storage({
    adapter: keystone.Storage.Adapters.FS,
    fs: {
        path: './public/uploads/',
        publicPath: '/public/uploads/',
        generateFilename: (file) => {
            const ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
            return `${file.filename}.${ext}`;
        }
    },
});
uploadExcelModel.add({
    file: {
        type: Types.File,
        storage: storage, 
        initial: true,
        label: 'archivo'
    },
    event: {
        type: Types.Relationship,
        ref: 'EventModel', initial: true,
        label: 'evento'
    },
})


uploadExcelModel.schema.post('save', function (next) {
    try {
        this.file.filename
        decompress(path.join(process.cwd(), '/public/uploads/'+this.file.filename),path.join(process.cwd(), '/public/uploads/test')).then(files=>{
            const route = files.filter((x)=>x.path.endsWith('xlsx') || x.path.endsWith('xls'))
            if(route.length < 1)
                throw new Error("excel file doesn't exists")
            const excelpath = path.join(process.cwd(), `/public/uploads/test/${route[0].path}`)
            excel.readExcel(excelpath,this.event)
        }).catch(e=>{
            console.log(e.message)
        })
    } catch (e) {
        throw new Error('Error while saving');
    }
})

uploadExcelModel.register()
uploadExcelModel.defaultColumns = 'file,event'

