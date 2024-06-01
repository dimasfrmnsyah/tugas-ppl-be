const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose
const saltRounds = 10

const ModelSchema = new Schema({
	username: { type: String, unique: true },
    fullName: { type: String },
	password: { type: String, required: true },
	deleted: { type: Boolean, default: false },
}, {
	timestamps: true,
})

ModelSchema.pre(['find', 'findOne', 'countDocuments'], function () {
	const { withDeleted } = this.options
	if (this._conditions.deleted) {
		// query by this._conditions
	} else if (!withDeleted) {
		this.where({ deleted: false })
	}
})
ModelSchema.pre('save', function (next) {
	const user = this
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next()

	// generate a salt
	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) return next(err)

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err2, hash) {
			if (err2) return next(err2)

			// override the cleartext password with the hashed one
			user.password = hash
			next()
		})
	})
})

ModelSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err)
		cb(null, isMatch)
	})
}

module.exports = mongoose.model('User', ModelSchema)
