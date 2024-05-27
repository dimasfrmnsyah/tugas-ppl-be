const axios = require('axios')
const { _apiMapidURL } = require('../constants')

const addDatasetMqttDriver = async (driver_id) => {
	try {
		const body = {
			name: driver_id,
			log_data: {
				var1: {
					name: 'Latitude',
					unit: 'degree',
					values: [],
					nMin: 0,
					nMax: 100,
					notif: false,
					hold: false,
				},
				var2: {
					name: 'Longitude',
					unit: 'degree',
					values: [],
					nMin: 0,
					nMax: 100,
					notif: false,
					hold: false,
				},
				var3: {
					name: 'Speed',
					unit: 'km/s',
					values: [],
					nMin: 0,
					nMax: 100,
					notif: false,
					hold: false,
				},
				var4: {
					name: 'Direction',
					unit: 'degree',
					values: [],
					nMin: 0,
					nMax: 100,
					notif: false,
					hold: false,
				},
				var5: {
					name: 'Altitude',
					unit: 'mdpl',
					values: [],
					nMin: 0,
					nMax: 100,
					notif: false,
					hold: false,
				},
			},
			folder_id: '',
			owner_id: '',
			owner_name: '',
			write_key: `kw${driver_id}`,
			read_key: `kr${driver_id}`,
		}

		await axios({
			method: 'post',
			url: `${_apiMapidURL}/items/create_dataset`,
			data: body,
		})
	}
	catch (e) {
		throw new Error(`addDatasetMqttDriver: ${e.message}`)
	}
}

module.exports = addDatasetMqttDriver
