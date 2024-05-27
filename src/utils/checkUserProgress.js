const { _account, _role } = require('../constants')

/* eslint-disable no-restricted-syntax */
const checkUserProgress = (
	field,
	user,
) => {
	const list = {
		shipper: {
			main: [
				'isFilled',
				'isAgreementCreated',
				'isOrderCreated',
			],
			optional: [
				'isPicInvited',
				'isWarehouseCreated',
			],
		},
		transporter: {
			main: [
				'isFilled',
				'isAgreementSubmitted',
				'isOrderAssigned',
			],
			optional: [
				'isDriverInvited',
				'isTruckCreated',
				'isDriverPaired',
			],
		},
		manager: {
			main: [
				'isFilled',
				'isAgreementSubmitted',
				'isOrderAssigned',
				'isOrderRequested',
			],
			optional: [],
		},
	}
	const _user = user
	const condUser = [
		_role.shipper,
		_role.transporter,
		_role.manager,
	]
	if (!condUser.includes(_user.role)) return _user
	const mainList = list[user.role].main
	const optionalList = list[user.role].optional
	const { userProgress } = user

	if (mainList.includes(field) && !user[field]) {
		_user[field] = true
		_user.userProgress = {
			current: userProgress.current + 1,
			total: mainList.length,
		}
	}
	else if (optionalList.includes(field) && !user[field]) {
		_user[field] = true
		_user.userProgress = {
			current: userProgress.current,
			total: mainList.length,
		}
	}

	if (field === 'newUser') _user.userProgress = { current: 0, total: mainList.length }

	return _user
}

module.exports = checkUserProgress
