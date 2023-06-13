const keystone = require('keystone');
let Types = keystone.Field.Types; 
const AcumulatedModel = new keystone.List("AcumulatedModel",{track: { 
    createdAt: false, 
    updatedAt: true, 
    updatedBy: false, 
    createdBy: false },
defaultSort: 'description',
schema: {
    usePushEach: true,
},
label: 'Total Acumulated',
map: { name: 'description' },
nocreate: false,
noedit: true,
nodelete: true,
hidden:true
});

AcumulatedModel.add({
    description:{type: Types.Text, required: true, initial: true},
    totalReceived:{type: Types.Number, required: true, initial: true, label: "Total SG Acumulated"},
    hash: {type: Types.Text, required: true, initial: true, label: "Hash"}
});

AcumulatedModel.defaultColumns = 'description,totalReceived,updatedAt'
AcumulatedModel.register();