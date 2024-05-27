const formatNumber = (
	defValue = 0,
) => {
	let result
	const value = parseFloat(defValue).toString().split('.')
	const num = Math.round(value[0])

	if (Number.isInteger(num)) {
		const reverse = num.toString().split('').reverse().join('')
		result = reverse.match(/\d{1,3}/g)
		result = result.join('.').split('').reverse().join('')
	}
	if (value[1]) {
		value[1] = parseFloat(`0.${value[1]}`).toFixed(5).toString().split('.')[1]
	}

	result = value[1] ? [result, value[1]].join(',') : result

	return result
}

module.exports = formatNumber
