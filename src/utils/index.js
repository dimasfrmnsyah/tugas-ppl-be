const getRandomCode = require('./getRandomCode')
const validateFileUpload = require('./validateFileUpload')
const filterEmptyInput = require('./filterEmptyInput')
const filterDataByField = require('./filterDataByField')
const createDocVerObj = require('./createDocVerObj')
const formatNumber = require('./formatNumber')
const getQuery = require('./getQuery')
const getQueryKs = require('./getQueryKs')
const getLookup = require('./getLookup')
const getTopLevelUserId = require('./getTopLevelUserId')
const getTopLevelUserFullName = require('./getTopLevelUserFullName')
const getTopLevelUserFotoProfile = require('./getTopLevelUserFotoProfile')
const { getCityByCoordinate } = require('./getLocation') // now mapid desprecated, move to here
const calculate = require('./calculate')
const addDatasetMqttDriver = require('./addDatasetMqttDriver')
const getNearestDriver = require('./getNearestDriver')
const getLastLocationDriver = require('./getLastLocationDriver')
const checkUserProgress = require('./checkUserProgress')

module.exports = {
	getRandomCode,
	validateFileUpload,
	filterEmptyInput,
	filterDataByField,
	createDocVerObj,
	formatNumber,
	getQuery,
	getQueryKs,
	getLookup,
	getTopLevelUserId,
	getTopLevelUserFullName,
	getTopLevelUserFotoProfile,
	getCityByCoordinate,
	calculate,
	addDatasetMqttDriver,
	getNearestDriver,
	getLastLocationDriver,
	checkUserProgress,
}
