const keystone = require('keystone');
const Types = keystone.Field.Types;
// const Firebase = require('../Firebase/Firebase')
const EventModel = new keystone.List('EventModel',{
	track: { createdAt: true, updatedAt: true, updatedBy: true, createdBy: true },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Eventos',
	map: { name: 'eventName' },
	nocreate: false,
	noedit:true,
});

EventModel.add({
    eventName:{
        type: Types.Text,
		required: true,
		unique: true,
		initial: true,
		default: 'Nombre del evento',
    },
    eventId:{
        type: Types.Number,
		required: true,
		unique: true,
		index: true,
		initial: true,
		default: 1,
        label:"Identificacion del Evento"
    },
	eventQr:{
		type: Types.Url,
		label:"Codigo QR"
	},
    eventDate:{
        type: Types.Datetime,required: true,initial: true, label:"Fecha del Evento"
    }
})


EventModel.schema.pre('save',function(next){
	const today = new Date();
	if(this.eventDate <= today){
        return next(new Error("Start day can not be before today or today!"));
    }
	this.eventQr = process.env.BASE_URL+process.env.API_VERSION+"/events/qr/"+this.eventId;
	next();
})

// EventModel.schema.post('save',async function(next){
// 	try {
// 		const event = this;
// 	const save = await Firebase.db.collection('Events').add({
// 		EventName:event.eventName,
// 		EventId:event.eventId,
// 		EventDate:event.eventDate
// 	})
// 	if(save)
//     	next();	
// 	} catch (error) {
// 		return next(new Error("Error communicating with the firebase database"))
// 	}
// })

// EventModel.schema.pre('remove', function(next){
// 	Firebase.db.collection('Events').where('EventId','==',this.eventId).get().then((x)=>{
// 		console.log(x)
// 		Firebase.db.collection('Events').doc(x.docs[0].id).delete().then(()=>next())
// 	})
	
// 	console.log(this)
// })



EventModel.defaultColumns = 'eventName, eventId, eventDate';
EventModel.register();