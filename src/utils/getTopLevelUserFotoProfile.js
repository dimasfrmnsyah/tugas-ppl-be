const { _role } = require('../constants')

module.exports = (user = {}) => {
	let { fotoProfile } = user

	if (
		user.parent
		&& (
			user.role == _role.shipper
			|| user.role == _role.transporter
			|| user.role == _role.manager
		)
	) {
		fotoProfile = user.parent.fotoProfile
	}

	return fotoProfile
}
