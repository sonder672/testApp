const keystone = require('keystone');
const {Types} = keystone.Field

const WalletModel = new keystone.List('WalletModel',{
    track:{createdAt: true, updatedAt: false, updatedBy: false, createdBy: false},
    defaultsort:'-createdAt',
    hidden:false,
    schema: {
		usePushEach: true,
	},
    label:'Wallet',
    searchField:'wallet',
    map:{name:'wallet'}
});

WalletModel.add({
    user:{
        type: Types.Relationship, required: true, index:true,unique:true ,initial: true,ref: "UserModel", label:"Usuario" 
    },
    wallet:{
        type: Types.Text , required: true, initial:true, unique:true
    }
});

WalletModel.defaultColumns = 'user,wallet';
WalletModel.register();