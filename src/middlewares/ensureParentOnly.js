const ensureParentOnly = () => function (req, res, next) {
	const { user } = req.headers.tokenDecoded
	const { parent } = user

	const isAllowed = !parent
	if (isAllowed) {
		next() // role is allowed, so continue on the next middleware
	}
	else {
		return res.status(403).json({ message: 'Forbidden' }) // user is forbidden
	}
}

module.exports = ensureParentOnly
