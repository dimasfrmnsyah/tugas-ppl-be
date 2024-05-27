/* eslint-disable no-lonely-if */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
const mongoose = require('mongoose')
// const moment = require('moment-timezone')
const transformFilter = require('./transformFilter')

const getFilter = (fd) => {
	let condition = {}

	let fieldPopulate = []

	for (let i = 0; i < fd.length; i += 1) {
		let fieldName = fd[i].id
		let fieldValue = fd[i].value
		let checkField = fieldName.split('.')

		if (checkField.length > 1) {
			if (fd[i].type === 'in') {
				fieldPopulate.push({
					parent: checkField[0],
					child: checkField[1],
					value: { $in: fieldValue },
				})
			}
			else if (fd[i].type === 'equal') {
				fieldPopulate.push({
					parent: checkField[0],
					child: checkField[1],
					value: fieldValue,
				})
			}
			else if (fd[i].type === 'between') {
				// for type between
				let fieldValueSplit = fieldValue.split('&')
				fieldValueSplit = fieldValueSplit.length === 2
					? fieldValueSplit : [0, 0]

				fieldPopulate.push({
					parent: checkField[0],
					child: checkField[1],
					value: {
						$gte: fieldValueSplit[0],
						$lte: fieldValueSplit[1],
					},
				})
			}
			else {
				fieldPopulate.push({
					parent: checkField[0],
					child: checkField[1],
					value: {
						$regex: `.*${fieldValue}.*`,
						$options: 'i',
					},
				})
			}
		}
		else {
			if (fd[i].type === 'in') {
				condition[fieldName] = fieldValue
			}
			else if (fd[i].type === 'equal') {
				condition[fieldName] = fieldValue
			}
			else if (fd[i].type === 'between') {
				// for type between
				condition[fieldName] = fieldValue
			}
			else {
				condition[fieldName] = fieldValue
			}
		}
	}

	return {
		condition,
		conditionPopulate: fieldPopulate,
	}
}

const getSort = (sData) => {
	let sorting = []

	if (sData.length !== 0) sorting.push(['createdAt', 'DESC'])

	for (let data of sData) {
		let fieldSplit = data.id
		fieldSplit = fieldSplit.split('.')
		if (fieldSplit.length > 1) sorting.push([...fieldSplit, data.desc ? 'DESC' : 'ASC'])
		else sorting.push([data.id, data.desc ? 'DESC' : 'ASC'])
	}

	return sorting
}


const getFilterLk = async (fd, isAggregate) => {
	let conditions = []
	for (let i = 0; i < fd.length; i += 1) {
		let condition = {}
		let [
			fieldName,
			fieldValue,
			filterType,
			// eslint-disable-next-line no-await-in-loop
		] = await transformFilter(fd[i].id, fd[i].value, fd[i].type, isAggregate)

		fieldValue = mongoose.Types.ObjectId.isValid(fieldValue)
            && fieldName !== 'externalId'
            && filterType !== 'in'
			? mongoose.Types.ObjectId(fieldValue)
			: fieldValue

		// condition per type
		if (filterType === 'in') {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'in'
			condition.type = fieldName
		}
		else if (filterType === 'equal') {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'equal'
			condition.type = fieldName
		}
		else if (filterType === 'between') {
			// for type between number
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'between'
			condition.type = fieldName
		}
		else if (filterType === 'between-date') {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'between-date'
			condition.type = fieldName
		}
		else if (filterType === 'between-date3') {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'between-date3'
			condition.type = fieldName
		}
		else if (filterType === 'between-date2') {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'between-date2'
			condition.type = fieldName
		}
		else if (filterType === 'size') {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'size'
			condition.type = fieldName
		}
		else if (filterType === 'exists') {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
			condition.cond = 'exists'
			condition.type = fieldName
		}
		else {
			condition[fieldName] = Number.isNaN(Number(fieldValue))
				? fieldValue
				: Number(fieldValue)
		}
		conditions.push(condition)
	}

	return conditions
}

const getSortLk = async (sData) => {
	let sorting = {}

	if (sData.length === 0) sorting.createdAt = -1

	for (let data of sData) {
		sorting[data.id] = data.desc ? -1 : 1
	}

	return sorting
}

const getQueryKs = async (query, isAggregate = false) => {
	try {
		let {
			page,
			pageSize,
			filtered,
			sorted,
			variety,
		} = query

		page = page ? Number(page) : 0
		pageSize = pageSize ? Number(pageSize) : 1500
		filtered = filtered ? JSON.parse(filtered) : []
		sorted = sorted ? JSON.parse(sorted) : []

		const sortedLk = await getSortLk(sorted)
		let filteredLk = await getFilterLk(filtered, isAggregate)

		sorted = getSort(sorted)
		const filter = getFilter(filtered)

		if (variety === 'pageByDate') {
			const interval = 1 // days

			const from = (page + 1) * interval
			const to = (page) * interval

			filteredLk.createdAt = {
				$gte: new Date(new Date().setDate(new Date().getDate() - from)),
				$lte: new Date(new Date().setDate(new Date().getDate() - to)),
			}
		}
		return {
			...query,
			page,
			pageSize,
			filtered: filter.condition,
			filteredPopulate: filter.conditionPopulate,
			sorted,
			sortedLk,
			filteredLk,
		}
	}
	catch (e) {
		throw new Error(`getQueryKs: ${e.message}`)
	}
}

module.exports = getQueryKs
