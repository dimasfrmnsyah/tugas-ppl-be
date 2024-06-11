/* eslint-disable no-unused-vars */
const express = require('express')

const router = express.Router()
const AuthController = require('../controllers/AuthControllers')
const PredictionControllers = require('../controllers/PredictionControllers')
const HistoryControllers = require('../controllers/HistoryControllers')
const UserController = require('../controllers/UserController')
const {authenticateJWT} = require('../middlewares');

// eslint-disable-next-line func-names
module.exports = function routes(app) {
	app.use('/api', router)
	router.post('/register', AuthController.register)
	router.post('/login', AuthController.login)
	router.post('/prediction',authenticateJWT,PredictionControllers.prediction)
	router.get('/history',authenticateJWT, HistoryControllers.history)
	router.get('/history-test',authenticateJWT, HistoryControllers.historyTesting)
	router.get('/history/:id',authenticateJWT, HistoryControllers.getOne)
	router.get('/user/me',authenticateJWT, UserController.me)
	router.put('/user/:id',authenticateJWT, UserController.updateUser)
	
}
