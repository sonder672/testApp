var keystone = require('keystone');
var SectionDisplayModel = keystone.list('SectionDisplayModel');

const CanDisplaySection = async () => {
    try {
        let candisplay = await SectionDisplayModel.model.findOne({},{CanDisplay:1, _id:0}).lean();
        return candisplay;
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

exports.CanDisplaySection = CanDisplaySection;