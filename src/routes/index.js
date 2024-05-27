/* eslint-disable no-unused-vars */
const express = require('express')

const router = express.Router()
const AuthController = require('../controllers/AuthControllers')

// eslint-disable-next-line func-names
module.exports = function routes(app) {
	app.use('/api', router)
	router.post('/register', AuthController.register)
	router.post('/login', AuthController.login)
}
