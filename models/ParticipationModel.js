const keystone = require('keystone');
const {Types} = keystone.Field;

const ParticipationModel = new keystone.List('ParticipationModel',{
	track: { createdAt: true, updatedAt: true, updatedBy: true, createdBy: true },
	defaultSort: '-createdAt',
	schema: {
		usePushEach: true,
	},
	label: 'Asistencia a eventos',
	searchFields:'user',
	nocreate: false,
	nodelete: false,
})

ParticipationModel.add({
    user:{
        type: Types.Text, initial:true,label:'Email de Usuario'
    },
    event:{type: Types.Relationship,initial:true ,ref:'EventModel', label:'Evento al que participó'}
})

ParticipationModel.defaultColumns = 'user,event'
ParticipationModel.register();