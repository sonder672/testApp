const keystone = require('keystone');
const rnd = require('./../utility/RandomSeed').rnd;
const RandomSeed = require('./../utility/RandomSeed').Random;
// const PreSaleModel = keystone.list('PreSaleModel');
const imagePathCrisol = (modelId) => {
	modelId = Number(modelId);
	if (modelId > 0 && modelId <= 5) {
		return process.env.IMAGES_PATH + 'CE' + modelId + '.png';
	} else if (modelId > 5 && modelId <= 10) {
		return process.env.IMAGES_PATH + 'DE' + (modelId % 5 + 1) + '.png';
	} else if (modelId > 10 && modelId <= 15) {
		return process.env.IMAGES_PATH + 'SE' + (modelId % 5 + 1) + '.png';
	} else if (modelId > 15 && modelId <= 20) {
		return process.env.IMAGES_PATH + 'CS' + (modelId % 5 + 1) + '.png';
	} else if (modelId > 20 && modelId <= 25) {
		return process.env.IMAGES_PATH + 'DS' + (modelId % 5 + 1) + '.png';
	} else if (modelId > 25 && modelId <= 30) {
		return process.env.IMAGES_PATH + 'SS' + (modelId % 5 + 1) + '.png';
	} else {
		return null;
	}

};

// const getStoneModelIdFromImage = (img) => {
// 	try {
// 		img = img.trim().toUpperCase();
//
// 		switch (img) {
// 		case 'P1':
// 			return 1;
// 		case 'P2':
// 			return 2;
// 		case 'P3':
// 			return 3;
// 		case 'P4':
// 			return 4;
// 		case 'P5':
// 			return 5;
// 		case 'P6':
// 			return 6;
// 		}
// 		throw 'invalid img ' + img;
// 	} catch (e) {
// 		console.log('getStoneModelIdFromImage', e);
// 	}
// };
// const getCrisolModelIdFromImage = (img) => {
// 	try {
// 		img = img.trim().toUpperCase();
// 		switch (img) {
// 		case 'CE1':
// 			return 1;
// 		case 'CE2':
// 			return 2;
// 		case 'CE3':
// 			return 3;
// 		case 'CE4':
// 			return 4;
// 		case 'CE5':
// 			return 5;
// 				//
// 		case 'DE1':
// 			return 6;
// 		case 'DE2':
// 			return 7;
// 		case 'DE3':
// 			return 8;
// 		case 'DE4':
// 			return 9;
// 		case 'DE5':
// 			return 10;
// 				//
// 		case 'SE1':
// 			return 11;
// 		case 'SE2':
// 			return 12;
// 		case 'SE3':
// 			return 13;
// 		case 'SE4':
// 			return 14;
// 		case 'SE5':
// 			return 15;
// 				//
// 		case 'CS1':
// 			return 16;
// 		case 'CS2':
// 			return 17;
// 		case 'CS3':
// 			return 18;
// 		case 'CS4':
// 			return 19;
// 		case 'CS5':
// 			return 20;
// 				//
// 		case 'DS1':
// 			return 21;
// 		case 'DS2':
// 			return 22;
// 		case 'DS3':
// 			return 23;
// 		case 'DS4':
// 			return 24;
// 		case 'DS5':
// 			return 25;
// 				//
// 		case 'SS1':
// 			return 26;
// 		case 'SS2':
// 			return 27;
// 		case 'SS3':
// 			return 28;
// 		case 'SS4':
// 			return 29;
// 		case 'SS5':
// 			return 30;
// 		}
// 		throw 'invalid img ' + img;
// 	} catch (e) {
// 		console.log('getCrisolModelIdFromImage', e);
// 	}
// };

const imagePathBeca = (modelId) => {
	modelId = Number(modelId);
	if (modelId > 0 && modelId <= 3) {
		return process.env.IMAGES_PATH + 'Bec' + modelId + '.png';
	} else {
		return null;
	}
};
const imagePathStone = (modelId) => {
	modelId = Number(modelId);
	if (modelId === 1) {
		return process.env.IMAGES_PATH + 'S_HIERRO.png';
	} else if (modelId === 2) {
		return process.env.IMAGES_PATH + 'S_PLOMO.png';
	} else if (modelId === 3) {
		return process.env.IMAGES_PATH + 'S_MERCURIO.png';
	} else if (modelId === 4) {
		return process.env.IMAGES_PATH + 'S_ESTANO.png';
	} else if (modelId === 5) {
		return process.env.IMAGES_PATH + 'S_COBRE.png';
	} else if (modelId === 6) {
		return process.env.IMAGES_PATH + 'S_SILVER.png';
	} else {
		return null;
	}
};
const stoneMetadata = async (modelId, tokenId, userId) => {
	modelId = Number(modelId);

	if (userId) {
		let preSaleModel = await PreSaleModel.model.findOne({
			user: userId,
			type: 'PIEDRAS',
			state: { $ne: 'CLAIMED' },
		}).lean();
		if (preSaleModel) {

			let foundIndex = -1;
			for (let i = 0; i < preSaleModel.modelIds.length && i < preSaleModel.claimed.length && foundIndex === -1; i++) {
				const tempModel = preSaleModel.modelIds[i];
				if (Number(modelId) === Number(tempModel) && preSaleModel.claimed[i] !== 1) {
					foundIndex = i;
					preSaleModel.claimed[i] = 1;
				}
			}
			if (foundIndex !== -1) {
				try {
					const data = JSON.parse(preSaleModel.data);
					const preSaleData = data[foundIndex];
					if (preSaleData) {
						/*
						*
						* let pod_plo = row['pod_plo'];
					let pod_hie = row['pod_hie'];
					let pod_mer = row['pod_mer'];
					let pod_est = row['pod_est'];
					let pod_cob = row['pod_cob'];
					let pod_pla = row['pod_pla'];
						* */
						const preSaleResult = {
							iron: Number(preSaleData.pod_hie),
							lead: Number(preSaleData.pod_plo),
							mercury: Number(preSaleData.pod_mer),
							tin: Number(preSaleData.pod_est),
							copper: Number(preSaleData.pod_cob),
							silver: Number(preSaleData.pod_pla),
						};
						const setQuery = {};
						setQuery['claimed.' + foundIndex] = 1;
						let allDones = true;
						for (let i = 0; i < preSaleModel.claimed.length && allDones; i++) {
							const tempModel = preSaleModel.modelIds[i];
							if (preSaleModel.claimed[i] !== 1) {
								allDones = false;
							}
						}
						if (allDones) {
							setQuery.state = 'CLAIMED';
						}


						await PreSaleModel.model.findOneAndUpdate({
							_id: preSaleModel._id,
						}, {
							$set: setQuery,
						});
						return preSaleResult;
					}
				} catch (e) {
					console.log('internal presale stoneMetadata', e);
				}
			} else {
				let allDones = true;
				for (let i = 0; i < preSaleModel.claimed.length && allDones; i++) {
					if (preSaleModel.claimed[i] !== 1) {
						allDones = false;
					}
				}
				if (allDones) {
					const setQuery = {};
					setQuery.state = 'CLAIMED';
					await PreSaleModel.model.findOneAndUpdate({
						_id: preSaleModel._id,
					}, {
						$set: setQuery,
					});
				}
			}


		}
	}

	const tempRnd = new RandomSeed(modelId * 1000 + Number(tokenId));
	const max = tempRnd.nextInt32(50, 100);
	const result = {
		iron: tempRnd.nextInt32(10, max - 1),
		lead: tempRnd.nextInt32(10, max - 1),
		mercury: tempRnd.nextInt32(10, max - 1),
		tin: tempRnd.nextInt32(10, max - 1),
		copper: tempRnd.nextInt32(10, max - 1),
		silver: tempRnd.nextInt32(10, max - 1),
	};
	if (modelId === 1) {
		result.stoneType = 'IRON';
		result.iron = max;
	} else if (modelId === 2) {
		result.stoneType = 'LEAD';
		result.lead = max;
	} else if (modelId === 3) {
		result.stoneType = 'MERCURY';
		result.mercury = max;
	} else if (modelId === 4) {
		result.stoneType = 'TIN';
		result.tin = max;
	} else if (modelId === 5) {
		result.stoneType = 'COPPER';
		result.copper = max;
	} else if (modelId === 6) {
		result.stoneType = 'SILVER';
		result.silver = max;
	} else {
		return null;
	}
	return result;
};


const crisolMetadata = async (modelId, tokenId, userId) => {
	try {
		console.log('crisolMetadata', modelId);
		modelId = Number(modelId);


		if (userId) {
			let preSaleModel = await PreSaleModel.model.findOne({
				user: userId,
				type: 'CRISOL',
				state: { $ne: 'CLAIMED' },
			}).lean();
			if (preSaleModel) {

				let foundIndex = -1;
				for (let i = 0; i < preSaleModel.modelIds.length && i < preSaleModel.claimed.length && foundIndex === -1; i++) {
					const tempModel = preSaleModel.modelIds[i];
					if (Number(modelId) === Number(tempModel) && preSaleModel.claimed[i] !== 1) {
						foundIndex = i;
						preSaleModel.claimed[i] = 1;
					}
				}
				if (foundIndex !== -1) {
					try {
						const data = JSON.parse(preSaleModel.data);
						const preSaleData = data[foundIndex];
						if (preSaleData) {
							/*
							*
							* let efi_calc = row['efi_calc'];
						let sue_calc = row['sue_calc'];
						let efi_dest = row['efi_dest'];
						let sue_dest = row['sue_dest'];
						let efi_subl = row['efi_subl'];
						let sue_subl = row['sue_subl'];
							* */
							const preSaleResult = {
								calcination: {
									efficiency: Number(preSaleData.efi_calc),
									luck: Number(preSaleData.sue_calc),
								},
								distillation: {
									efficiency: Number(preSaleData.efi_dest),
									luck: Number(preSaleData.sue_dest),
								},
								sublimation: {
									efficiency: Number(preSaleData.efi_subl),
									luck: Number(preSaleData.sue_subl),
								},
							};
							const setQuery = {};
							setQuery['claimed.' + foundIndex] = 1;
							let allDones = true;
							for (let i = 0; i < preSaleModel.claimed.length && allDones; i++) {
								const tempModel = preSaleModel.modelIds[i];
								if (preSaleModel.claimed[i] !== 1) {
									allDones = false;
								}
							}
							if (allDones) {
								setQuery.state = 'CLAIMED';
							}
							await PreSaleModel.model.findOneAndUpdate({
								_id: preSaleModel._id,
							}, {
								$set: setQuery,
							});
							return preSaleResult;
						}
					} catch (e) {
						console.log('internal presale crisolMetadata', e);
					}
				} else {
					let allDones = true;
					for (let i = 0; i < preSaleModel.claimed.length && allDones; i++) {
						if (preSaleModel.claimed[i] !== 1) {
							allDones = false;
						}
					}
					if (allDones) {
						const setQuery = {};
						setQuery.state = 'CLAIMED';
						await PreSaleModel.model.findOneAndUpdate({
							_id: preSaleModel._id,
						}, {
							$set: setQuery,
						});
					}
				}

			}
		}

		const tempRnd = new RandomSeed(modelId * 1000 + Number(tokenId));
		const result = {
			calcination: {
				efficiency: 0,
				luck: 0,
			},
			distillation: {
				efficiency: 0,
				luck: 0,
			},
			sublimation: {
				efficiency: 0,
				luck: 0,
			},
		};
		const ranges = {
			0: { min: 15, max: 20 },
			1: { min: 21, max: 40 },
			2: { min: 41, max: 60 },
			3: { min: 61, max: 80 },
			4: { min: 81, max: 100 },
		};
		const getMaxMin = (range, maxSum) => {
			let max = tempRnd.nextInt32(range.min + 3, range.max + 1);
			while (range.min === max) {
				max = tempRnd.nextInt32(range.min + 3, range.max + 1);
			}
			let min = tempRnd.nextInt32(range.min, max);

			for (let i = 0; max + min > maxSum; i++) {
				max = tempRnd.nextInt32(range.min + 1, range.max);
				min = tempRnd.nextInt32(range.min + 1, max);
				if (i > 100) {
					return null;
				}

			}
			if (tempRnd.isTrueOnPercent(50)) {
				return { min: min, max: max, v1: min, v2: max };
			} else {

				return { min: min, max: max, v1: max, v2: min };
			}
		};
		const mainRange = ranges[(modelId - 1) % 5];
		const maxRange = getMaxMin(mainRange, 200);
		if (maxRange === null) {
			return await crisolMetadata(modelId);
		}
		const otherRange = { min: 15, max: mainRange.max - 1 };
		const temp1 = getMaxMin(otherRange, maxRange.max + maxRange.min);
		const temp2 = getMaxMin(otherRange, maxRange.max + maxRange.min);
		const temp3 = getMaxMin(otherRange, maxRange.max + maxRange.min);
		if (temp1 === null || temp2 === null || temp3 === null) {
			return await crisolMetadata(modelId);
		}
		result.calcination.efficiency = temp3.v1;
		result.calcination.luck = temp3.v2;
		result.distillation.efficiency = temp1.v1;
		result.distillation.luck = temp1.v2;
		result.sublimation.efficiency = temp2.v1;
		result.sublimation.luck = temp2.v2;
		if (modelId > 0 && modelId <= 5) {

			result.calcination.efficiency = maxRange.max;
			result.calcination.luck = maxRange.min;

		} else if (modelId > 5 && modelId <= 10) {

			result.distillation.efficiency = maxRange.max;
			result.distillation.luck = maxRange.min;

		} else if (modelId > 10 && modelId <= 15) {

			result.sublimation.efficiency = maxRange.max;
			result.sublimation.luck = maxRange.min;
		} else if (modelId > 15 && modelId <= 20) {
			result.calcination.efficiency = maxRange.min;
			result.calcination.luck = maxRange.max;

		} else if (modelId > 20 && modelId <= 25) {

			result.distillation.efficiency = maxRange.min;
			result.distillation.luck = maxRange.max;
		} else if (modelId > 25 && modelId <= 30) {

			result.sublimation.efficiency = maxRange.min;
			result.sublimation.luck = maxRange.max;
		} else {
			return null;
		}
		return result;
	} catch (e) {
		console.log('crisolMetadata', e);
		throw e;
	}
};

exports.imagePathCrisol = imagePathCrisol;
exports.imagePathBeca = imagePathBeca;
exports.imagePathStone = imagePathStone;
// exports.crisolMetadata = crisolMetadata;
// exports.stoneMetadata = stoneMetadata;
// exports.getCrisolModelIdFromImage = getCrisolModelIdFromImage;
// exports.getStoneModelIdFromImage = getStoneModelIdFromImage;
