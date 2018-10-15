
'use strict'

const request = require('request')
const apiKey = process.argv[2]

getInput('enter target currency', (err, target) => {
	if (err) {
		console.log(err.message)
		process.exit()
	}
	target = target.trim()
	getInput('enter amount to be converted', (err, amount) => {
		if (err) {
			console.log(err.message)
			process.exit()
		}
		amount = amount.trim()
		checkValidCurrencyCode(target, err => {
			if (err) {
				console.log(err.message)
				process.exit()
			}
			const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&symbols=${target}&format=1`
			getData(url, target, amount, (err, data, exchangedAmount) => {
				if (err) {
					console.log(err.message)
					process.exit()
				}
				printObject(target, amount, exchangedAmount)
				process.exit()
			})
		})
	})
})

function getInput(prompt, callback) {
	try {
		process.stdin.resume()
		process.stdin.setEncoding('utf8')
		process.stdout.write(`${prompt}: `)
		process.stdin.on('data', text => callback(null, text))
	} catch(err) {
		callback(err)
	}
}

function checkValidCurrencyCode(code, callback) {
	code = code.trim()
	const url = `http://data.fixer.io/api/latest?access_key=${apiKey}`;
	request(url, (err, res, body) => {
		if (err) callback(new Error('invalid API call'))
		const rates = JSON.parse(body).rates
		if (!rates.hasOwnProperty(code)) callback(new Error(`invalid currency code ${code}`))
		callback(null, true)
	})
}

function getData(url, target, amount, callback) {
	request(url, (err, res, body) => {
		if (err) callback(new Error('invalid API call'))
		const rates = JSON.parse(body).rates
		const exchangeRate = rates[`${target}`]
		const exchangeAmount = amount * exchangeRate
		callback(null, body, parseFloat(exchangeAmount).toFixed(4))
	})
}

function printObject(target, amount, exchangedAmount) {
	console.log('You will get ' + exchangedAmount + ' ' + target + ' for your input of ' + amount + ' EUR')
}
