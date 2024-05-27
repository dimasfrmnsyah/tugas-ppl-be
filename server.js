/* eslint-disable no-console */
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '500mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ limit: '256mb', extended: true }))

app.use('/api', express.static(path.join(__dirname, 'public')))

// port config
const port = process.env.PORT || 5001

// DB Config
const config = require('./src/config/config')

const { db } = config

// Connect to Mongo
mongoose.set('debug', true)
mongoose
	.connect(db, {
		useNewUrlParser: true, // Adding new mongo url parser
		useCreateIndex: true, // Preventing something depecated
		useUnifiedTopology: true,
	})
	.then(() => console.log(`MongoDB Connected to ${process.env.NODE_ENV}`))
	.catch((err) => console.log(err))


// Require routes
require('./src/routes')(app)

app.get('/', (req, res) => {
	res.send(`Hello, Welcome to Karlo! ${process.env.NODE_ENV[1]}`)
})

// Express application will listen to port mentioned in our configuration
app.listen(port, (err) => {
	if (err) throw err
	console.log(`App listening on port ${port}`)
})

