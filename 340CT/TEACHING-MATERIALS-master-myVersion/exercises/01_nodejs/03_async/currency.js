
'use strict'

const request = require('request')
console.log(process.argv)
try {
	if (process.argv.length < 3) {
		throw 'missing parameter'
	}
	const symbol = process.argv[2].toUpperCase()
	const apikey = 'YOUR KEY HERE'
	const url = `http://fixer.io/latest?access_key=${apikey}symbols=${symbol}`
	console.log(url)
	request.get( url, (err, res, body) => {
		if (err) {
			throw 'could not complete request'
		}
		const json = JSON.parse(body)
		const output = JSON.stringify(json.rates, null, 2)
		console.log(output)
	})
} catch(err) {
	console.log(err)
}
