const dbConf = {
	production: 'mongodb+srv://dimasfirmansyah:wuo7pDlJhed1vw00@ppl.7wyd9uc.mongodb.net/?retryWrites=true&w=majority&appName=ppl',

}

const ENV = process.env.NODE_ENV || 'development'
const db = dbConf[ENV]
const secret = '123'

const conf = {
	db,
	secret,
}

module.exports = conf