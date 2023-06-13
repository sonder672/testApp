const keystone = require('keystone');
const Types = keystone.Field.Types;
const moment = require('moment');
const date_format = moment();
/**
 * Discounts
 * ==========
 */
const DiscountModel = new keystone.List('DiscountModel', {
	track: { createdAt: true, updatedAt: true, updatedBy: true, createdBy: true },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Countdown',
	map: { name: 'DateExpired' },
	hidden:true
});

DiscountModel.add({
    DateInit:{type: Types.Datetime,required: true,initial: true, label:"Start Discount Date"},
    DateExpired:{type: Types.Datetime,required: true,initial: true, label:"End Discount Date"},
    Percentage:{type:Types.Number, required: true,initial: true}
});

DiscountModel.schema.pre('save', async function (next) {
        const today = new Date();
        if(this.DateInit < today){
            next(new Error("Start day can not be before today!"));
        }
        if(this.DateExpired < this.DateInit){
            next(new Error("Expiration can not be before Start day!"));
    	}
    	if(this.DateExpired < this.DateInit){
            next(new Error("Expiration can not be before now"));
    	} else {
    		next();
    	}
    });
    

DiscountModel.defaultColumns = 'DateInit,DateExpired,Percentage,NftObjective';
DiscountModel.register();
