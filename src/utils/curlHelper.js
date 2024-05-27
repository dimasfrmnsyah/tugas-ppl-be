const curlHelper = (request, BASE_URL) => {

	const getHeaders = () => {
		let { headers } = request
		let curlHeaders = ''

		// get the headers concerning the appropriate method (defined in the global axios instance)
		if (headers.hasOwnProperty('common')) {
			headers = request.headers[request.method]
		}

		// add any custom headers (defined upon calling methods like .get(), .post(), etc.)
		for (const property in request.headers) {
			if (
				!['common', 'delete', 'get', 'head', 'patch', 'post', 'put'].includes(
					property,
				)
			) {
				headers[property] = request.headers[property]
			}
		}

		for (const property in headers) {
			const header = `${property}:${headers[property]}`
			curlHeaders = `${curlHeaders} -H "${header}"`
		}

		return curlHeaders.trim()
	}

	const getMethod = () => {
		return `-X ${request.method.toUpperCase()}`
	}

	const getBody = () => {
		if (
			typeof request.data !== 'undefined'
			&& request.data !== ''
			&& Object.keys(request.data).length
			&& request.method.toUpperCase() !== 'GET'
		) {
			const data =				typeof request.data === 'object'
				|| Object.prototype.toString.call(request.data) === '[object Array]'
					? JSON.stringify(request.data)
					: request.data
			return `--data '${data}'`.trim()
		}
		return ''
	}

	const getUrl = () => {
		return `${BASE_URL}${request.url}`
	}

	const getQueryString = () => {
		let params = ''
		let i = 0

		for (const param in request.params) {
			if (i != 0) {
				params += `&${param}=${request.params[param]}`
			} else {
				params = `?${param}=${request.params[param]}`
			}
			i++
		}

		return params
	}

	const getBuiltURL = () => {
		let url = getUrl()

		if (getQueryString() != '') {
			url = url.charAt(url.length - 1) == '/' ? url.substr(0, url.length - 1) : url
			url += getQueryString()
		}

		return url.trim()
	}

	const generateCommand = () => {
		return `curl ${getMethod()} ${getHeaders()} ${getBody()} "${getBuiltURL()}"`
			.trim()
			.replace(/\s{2,}/g, ' ')
	}

	return generateCommand()

}

module.exports = curlHelper