/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */

const generateLookup = (data) => {
	const newData = {
		$lookup: {
			from: `${data.collection}`,
			let: { [`${data.model}`]: `$${data.localField || data.model}` },
			pipeline: [
				{
					$match: {
						$expr: data.unwind !== false
							? { $eq: [`$$${data.model}`, '$_id'] } // for object id
							: { $in: ['$_id', `$$${data.model}`] }, // for array of object id
					},
				},
			],
			as: `${data.as || data.localField || data.model}`,
		},
	}
	return newData
}

const generateUnwind = (data) => {
	const newData = {
		$unwind: {
			path: `$${data.localField || data.model}`,
			preserveNullAndEmptyArrays: true,
		},
	}
	return newData
}

const generateProject = (data) => {
	let project = {}
	for (let j = 0; j < data.select.length; j += 1) {
		const val = data.select[j].includes('-')
			? 0
			: 1

		const field = data.select[j].includes('-')
			? data.select[j].replace('-', '')
			: data.select[j]

		project[field] = val
	}

	return {
		$project: project,
	}
}

const getLookup = async (tables) => {
	let manipulatedLookup = []

	const addLookup = async (lookup, level) => {
		// generate data select field
		let additionalPipelineLv1 = []
		// select some field
		if (lookup.select && lookup.select.length > 0) {
			const currentProject = await generateProject(lookup)

			additionalPipelineLv1 = [...additionalPipelineLv1, currentProject]
		}

		// generate data lookup per table
		const currentLookupLv1 = await generateLookup(lookup)

		// set unwind true, if not define / not false
		// default lookup return array of object, to convert to object set unwind true
		let currentUnwindLv1 = []
		if (lookup.unwind !== false) {
			const cu = await generateUnwind(lookup)
			currentUnwindLv1.push(cu)
		}

		// lv 2
		if (lookup.lookup && lookup.lookup.length > 0) {

			for (let i = 0; i < lookup.lookup.length; i += 1) {
				const lookupLv2 = lookup.lookup[i]
				// select some field
				let additionalPipelineLv2 = []
				if (lookupLv2.select && lookupLv2.select.length > 0) {
					const currentProject = await generateProject(lookupLv2)
					additionalPipelineLv2 = [...additionalPipelineLv2, currentProject]
				}

				// generate data lookupLv2 per table
				const currentLookupLv2 = await generateLookup(lookupLv2)

				// set unwind true, if not define / not false
				// default lookupLv2 return array of object, to convert to object set unwind true
				let currentUnwindLv2 = []
				if (lookupLv2.unwind !== false) {
					const cu = await generateUnwind(lookupLv2)
					currentUnwindLv2.push(cu)
				}

				currentLookupLv2.$lookup.pipeline = [
					...currentLookupLv2.$lookup.pipeline,
					...additionalPipelineLv2,
				]

				additionalPipelineLv1 = [
					...additionalPipelineLv1,
					{ ...currentLookupLv2 },
					...currentUnwindLv2,
				]
			}
		}

		currentLookupLv1.$lookup.pipeline = [
			...currentLookupLv1.$lookup.pipeline,
			...additionalPipelineLv1,
		]
		manipulatedLookup = [
			...manipulatedLookup,
			{ ...currentLookupLv1 },
			...currentUnwindLv1,
		]
	}

	const loopLookup = async (data, level = 0) => {
		for (let i = 0; i < data.length; i += 1) {
			const lookup = data[i]
			await addLookup(lookup, level)
		}
	}
	await loopLookup(tables, 0)
	return manipulatedLookup
}

module.exports = getLookup
