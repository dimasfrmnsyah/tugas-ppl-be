/* eslint-disable no-restricted-syntax */
// desprecated move to filterData by field
module.exports = (form) => {
	const ObjKeys = Object.keys(form)
	const newForm = {}
	for (const field of ObjKeys) {
		if (![undefined, null, ''].includes(form[field])) {
			newForm[field] = form[field]
		}
	}
	return newForm
}
