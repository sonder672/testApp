const keystone = require('keystone');
let Types = keystone.Field.Types; 
const TotalModel = new keystone.List("TotalModel",{track: { createdAt: true, updatedAt: true, updatedBy: true, createdBy: true },
defaultSort: 'description',
schema: {
    usePushEach: true,
},
label: 'Total',
map: { name: 'description' },
hidden:true,
nocreate: false,
noedit: true,
nodelete: true
});

TotalModel.add({
    description:{type: Types.Text, required: true, initial: true},
    totalUnits:{type: Types.Number, required: true, initial: true},
    totalReceived:{type: Types.Number, required: true, initial: true}
});

TotalModel.defaultColumns = 'description,totalUnits,totalReceived'
TotalModel.register();
