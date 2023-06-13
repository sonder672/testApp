var keystone = require('keystone')
let Types = keystone.Field.Types;

let ClaimersModel = new keystone.List('ClaimersModel',{
    track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false},
    hidden: true,
    nodelete:true,
    nocreate:true,
    noedit: true,
    schema: {
        usePushEach: true
    },
    searchFields:'user',
    label: 'List of User and SG Avalaible to Mint'
});

ClaimersModel.add({
    user:{type: Types.Text, required: true, initial: true, label: 'User'},
    sgType1:{type: Types.Number , required: true, initial: true, label: 'SG 1.0'},
    sgType2:{type: Types.Number , required: true, initial: true, label: 'SG 2.0'},
    sgType3:{type: Types.Number , required: true, initial: true, label: 'SG 3.0'},
    sgType4:{type: Types.Number , required: true, initial: true, label: 'SG 4.0'},
    sgType5:{type: Types.Number , required: true, initial: true, label: 'SG 5.0'},
});


ClaimersModel.defaultColumns = 'user,sgType1,sgType2,sgType3,sgType4,sgType5'
ClaimersModel.register();