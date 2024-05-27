const _role = require('../constants/role')

module.exports = (user = {}) => {
	let  { _id }  = user
	
	if (
		user.parent
		&& (
			user.role == _role.shipper
			|| user.role == _role.transporter
			|| user.role == _role.manager
		)
	) {
		_id = user.parent._id
	}
	// console.log(_id,"ieu get top level")
	return _id
}
