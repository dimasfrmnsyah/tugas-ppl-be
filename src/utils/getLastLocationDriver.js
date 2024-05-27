const xhr = require('../modules/xhr')
const { _apiMapidURL } = require('../constants')

const getLastLocationDriver = async (driver_id) => {
	try {
    const options = {
			baseURL: _apiMapidURL,
    }
    
    if(!driver_id) throw new Error('Silahkan masukan id driver')

    const res = await xhr.get(`/api/request?key=kr${driver_id}`, options)

    return res
	}
	catch (e) {
    console.log(e)
		throw new Error(`getLastLocationDriver: ${e.message}`)
	}
}

module.exports = getLastLocationDriver
