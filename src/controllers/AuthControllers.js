const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
	User,
} = require('../models')

exports.login = async (req, res) => {
	const {
		username,
		password,
		isLoginKapps,
	} = req.body

	try {
		// find user
		const user = await User.findOne({
			$or: [
				{ username:username },
			],
		})
		if (!user) {
			return res.status(404).json({ message: 'User tidak ditemukan' })
		}

		// eslint-disable-next-line prefer-arrow-callback
		user.comparePassword(password, async function (err, isMatch) {
			if (err) throw err

			if (isMatch) {
				// Passwords match
				const userObj = { ...user._doc, isKapps: isLoginKapps }
				delete userObj.password
				delete userObj.token
				// generate token
				const token = jwt.sign({ user: userObj }, 'dimasganteng1111', { expiresIn:3999999999999 })


				return res.status(200).json({
					message: 'success',
					user: {
						...userObj,
					},
					token,
				})
			}
			else {
				// Passwords don't match
				return res.status(400).json({ message: 'Your password is incorrect' })
			}
		})
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}
exports.register = async (req, res) => {
	// const { user } = req.headers.tokenDecoded
	const {
		username,
		fullName,
		password,
	} = req.body

	try {
		const isExistUsername = await User.findOne({ username })
		if (isExistUsername) {
			return res.status(400).json({success:false, message: 'Username sudah digunakan' })
		}

		const payloadUser = {
			fullName,
			username,
			password,
		}

		const usr = new User(payloadUser)

		usr.save()

		return res.status(200).json({ success:true, newUser:{fullName: usr.fullName,username:usr.username} })
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}