exports.create = {
	BlockModel: [
		{
			key: 'market',
			value: +process.env.CONTRACT_MARKETPLACE_BLOCK || +process.env.INITIAL_BLOCK
		},
		{
			key: 'Sg',
			value: +process.env.CONTRACT_MARKETPLACE_BLOCK || +process.env.INITIAL_BLOCK
		},
		{
			key: 'Liquid',
			value: +process.env.CONTRACT_MARKETPLACE_BLOCK || +process.env.INITIAL_BLOCK
		},
	]
};
