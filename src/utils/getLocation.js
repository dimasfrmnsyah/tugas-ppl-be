
const axios = require('axios')
const Kota = require('../models/Master/Kota')
const { _nowMapidURL } = require('../constants')

const getLocation = async (coordinate) => {
	const res = await axios({
		method: 'post',
		url: `${_nowMapidURL}/location/getgeocode`,
		data: {
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
		},
	})

	return res.data
}

const getCityByCoordinate = async (coordinate) => {
	const detailLocation = await getLocation(coordinate)

	if (detailLocation.length > 0) {
		const kota = await Kota.findOne({
			name: detailLocation[0].KAB_KOT,
		})
		return kota
	}

	return null
}

module.exports = {
	getLocation,
	getCityByCoordinate,
}
