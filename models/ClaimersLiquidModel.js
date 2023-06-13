var keystone = require('keystone')
let Types = keystone.Field.Types;

let ClaimersLiquidModel = new keystone.List('ClaimersLiquidModel',{
    track: { createdAt: true, updatedAt: true, updatedBy: false, createdBy: false},
    hidden: true,
    nodelete:true,
    nocreate:true,
    noedit: true,
    schema: {
        usePushEach: true
    },
    searchFields:'user',
    label: 'List of User and LIQUIDS Avalaible to Mint'
});

ClaimersLiquidModel.add({
    user:{type: Types.Text, required: true, initial: true, label: 'User'},
    LiquidType1:{type: Types.Number , required: true, initial: true, label: 'PROMISE'},
    LiquidType2:{type: Types.Number , required: true, initial: true, label: 'STAR'},
    LiquidType3:{type: Types.Number , required: true, initial: true, label: 'LEGEND'},
    LiquidType4:{type: Types.Number , required: true, initial: true, label: 'MYTH'},
    LiquidType5:{type: Types.Number , required: true, initial: true, label: 'GOD'},
});


ClaimersLiquidModel.defaultColumns = 'user,LiquidType1,LiquidType2,LiquidType3,LiquidType4,LiquidType5'
ClaimersLiquidModel.register();