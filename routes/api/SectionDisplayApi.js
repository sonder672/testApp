var keystone = require('keystone');
// var SectionDisplayModel = keystone.list('SectionDisplayModel');
var sectionDisplayViewModel = require('../viewModel/SectionDisplayViewModel');

const DisplaySection = async (req, res) => {
    try {
        let candisplay = await sectionDisplayViewModel.CanDisplaySection();
        return res.status(200).json(candisplay);
    } catch (error) {
        console.log(error);
        return res.status(500).json({errorMessage:error});
    }
    
}

exports.DisplaySection = DisplaySection;