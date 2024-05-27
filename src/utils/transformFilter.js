const yup = require('yup')

const Order = require('../models/Order')
const Cluster = require('../models/Cluster')
const Kota = require('../models/Master/Kota')
const User = require('../models/User')
const filterDataByField = require('./filterDataByField')

const checkField = {
	username: yup.string().min(4),
	fullName: yup.string().min(4),
	orderNumber: yup.string().min(5),
}

const validationFeld = async (data, field) => {
	const validator = yup.object(filterDataByField(checkField, field))
	const result = await validator.validate(data)
	return result
}

const transformFilter = async (
	fieldName,
	fieldValue,
	filterType,
	isAggregate,
) => {
	try {
		let response

		const fieldNameSplit = fieldName.split('.')
		const firstFieldName = fieldNameSplit[0]
		const secondFieldName = fieldNameSplit[1]
		if (firstFieldName === 'invoice') {
			response = [fieldName, fieldValue, filterType]
		}
		if (firstFieldName.includes('cluster')) {
			const cluster = await Cluster.findOne({ _id: fieldValue })
      const {truckOption} = cluster
			// list city from province
			const cityProv = await Kota.find({
				provinsi: {
					$in: cluster.provincies,
				},
			})
			let cityList = cityProv.map((row) => row._id)
			cityList = [
				...cityList,
				...cluster.cities,
			].join(',')

			let newFieldName = firstFieldName === 'clusterOrder'
				? 'shipment.routeFrom'
				: 'currentCity'

      if (firstFieldName === 'clusterTruck' && truckOption?.length) {
        if (truckOption.includes('fromLocation')) newFieldName = 'fromLocation.city'
        if (truckOption.includes('toLocation')) newFieldName = 'toLocation.city'
        if (truckOption.includes('lastLocation')) newFieldName = 'currentCity'
      }

			response = [newFieldName, cityList, 'in']
		}
		else if (fieldNameSplit.length === 1) {
			response = [fieldName, fieldValue, filterType]
		}
		else if (fieldNameSplit.length === 2 && isAggregate) {
			response = [fieldName, fieldValue, filterType]
		}
		else if (fieldNameSplit.length === 2 && secondFieldName === '_id') {
			response = [firstFieldName, fieldValue, filterType]
		}
		else if (fieldNameSplit.length === 2 && secondFieldName !== '_id') {
			let newFieldValue = fieldValue
			let data = []

			await validationFeld({ [secondFieldName]: fieldValue }, [
				secondFieldName,
			])
			if (firstFieldName === 'thirdPartyOrderChild' || firstFieldName === 'order') {
				data = await Order.find({
					$or: [{
						[secondFieldName]: {
							$regex: `.*${fieldValue}.*`,
							$options: 'i',
						},
					},
					{ [`shipment.${secondFieldName}`]: fieldValue },
					],
				})
			}
			else if (
				firstFieldName === 'shipper'
        || firstFieldName === 'transporter'
        || firstFieldName === 'driver'
			) {
				data = await User.find({
					[secondFieldName]: {
						$regex: `.*${fieldValue}.*`,
						$options: 'i',
					},
				})
				if (firstFieldName === 'orderNumber') {
					data = await Order.find({
						[firstFieldName]: {
							$regex: `.*${fieldValue}.*`,
							$options: 'i',
						},
					})
				}
			}

			newFieldValue = data.map((row) => row._id).toString()

			response = [firstFieldName, newFieldValue, 'in']
		}
		else {
			throw new Error('condition doesnt match')
		}

		return response
	}
	catch (e) {
		throw new Error(`transformFilter ${e.message}`)
	}
}

module.exports = transformFilter
