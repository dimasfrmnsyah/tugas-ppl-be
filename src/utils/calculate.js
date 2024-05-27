
const _ = require('lodash')

const tonToKg = (value) => Number(value) * 1000
const kgToTon = (value) => Number(value) / 1000
const radianToKiloMeter = (value) => Number(value) * 6378.1
const radianToMeter = (value) => radianToKiloMeter(value) * 1000
const kiloMeterToMeter = (value) => Number((Number(value) * 1000).toFixed(2))
const meterToKiloMeter = (value) => Number((Number(value) / 1000).toFixed(2))
const sumBy = (arr, field) => _.sumBy(arr, (o) => {
	const newField = field.split('.')
	let value = 0

	if (newField.length === 1) {
		value = Number.isNaN(Number(o[field])) ? 0 : Number(o[field])
	}
	if (newField.length === 2) {
		value = Number.isNaN(Number(o[newField[0]][newField[1]])) ? 0 : Number(o[newField[0]][newField[1]])
	}

	return _.round(value, 5)
})

module.exports = {
	tonToKg,
	kgToTon,
	radianToKiloMeter,
	radianToMeter,
	kiloMeterToMeter,
	meterToKiloMeter,
	sumBy,
}
