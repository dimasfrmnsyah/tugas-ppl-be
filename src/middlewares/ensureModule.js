
const { _role } = require('../constants')

const ensureModule = (module) => {
	const isAllowed = (permission) => {
		let allow = false

		const split = module.split('.')
		if (
			permission[split[0]]
			&& permission[split[0]][split[1]]) {
			allow = true
		}
		return allow
	}

	return function (req, res, next) {

		const { user } = req.headers.tokenDecoded
		const { permission, role, parent } = user

		// check module permission
		// only for child of shipper & transporter
		if (
			parent &&
			(
				role === _role.shipper
				|| role === _role.transporter
			)
		) {
			if (isAllowed(permission)) {
				next()
			}
			else return res.status(403).json({ message: 'Access Denied' })
		}
		else {
			next()
		}
	}
}

module.exports = ensureModule
