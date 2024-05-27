const { _role } = require('../constants')

module.exports = (user = {}) => {
	let { username, fullName } = user

	if (
		user.parent
		&& (
			user.role == _role.shipper
			|| user.role == _role.transporter
			|| user.role == _role.manager
		)
	) {
		fullName = user.parent.fullName
	}

	return (fullName || username)
}
