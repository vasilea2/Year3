
'use strict'

const readline = require('readline-sync')
const directions = require('./directions')

const apiKey = process.argv[2]

const origin = String(readline.question('start address: ')).trim()
const destination = String(readline.question('finish address: ')).trim()

directions.getDistance(apiKey, origin, destination, (err, distance) => {
	try {
		if (err) throw err
		console.log(distance)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})

console.log('EOF')
