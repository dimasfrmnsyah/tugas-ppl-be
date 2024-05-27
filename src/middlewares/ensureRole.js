const ensureRole = (allowed) => {
	const isAllowed = (role) => allowed.indexOf(role) > -1

	return function (req, res, next) {
		const { user } = req.headers.tokenDecoded
		const { role } = user

		if (isAllowed(role)) {
			next() // role is allowed, so continue on the next middleware
		}
		else {
			return res.status(403).json({ message: 'Forbidden' }) // user is forbidden
		}
	}
}

module.exports = ensureRole
