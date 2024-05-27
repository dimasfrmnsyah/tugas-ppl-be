const xhr = require('../modules/xhr')
const { _apiMapidURL } = require('../constants')

const getNearestDriver = async ({
	lat,
	long,
	distance, // KM
}) => {
	try {
		const data = {
			lat,
			long,
			distance,
		}

		const options = {
			baseURL: _apiMapidURL,
		}

		const res = await xhr.post('/items/geocoding', data, options)
		return res
	}
	catch (e) {
		throw new Error(`getNearestDriver: ${e.message}`)
	}
}

module.exports = getNearestDriver
