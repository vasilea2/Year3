
'use strict'

/**
 * directions module.
 * @module directions
 */

/**
 * Callback used by apiCall
 * @callback apiCallback
 * @param {error} err - error returned (null if no error)
 * @param {data} route - the data returned as an object
 */

const request = require('request')

/**
 * returns the driving distance between two locations
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
exports.getDistance = (apiKey, origin, destination, callback) => {
	apiCall(apiKey, origin, destination, (err, route, time, stepsArray) => {
		if (err) return callback(err)
		let response = `${destination} is ${route.distance.text} from ${origin}. It will take you ${time}`
		for (let i in stepsArray) response += '\n' + stepsArray[i]
		return callback(null, response)
	})
}

/**
 * @function apiCall
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
function apiCall(apiKey, origin, destination, callback) {
	const firstIndex = 0
	const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
	console.log(url)
	request.get(url, (err, res, body) => {
		if (err) return callback(new Error('Google API error'))
		// const keys = Object.keys(obj);
		const json = JSON.parse(body)
		if (json.status !== 'OK') return callback(new Error('invalid location'))
		const route = json.routes[firstIndex].legs[firstIndex]
		getDuration(json, (err, duration, array) => {
			if (err) return callback(err)
			return callback(null, route, duration, array)
		})
	})
}

function getDuration(jsonBody, callback) {
	const firstIndex = 0
	const time = jsonBody.routes[firstIndex].legs[firstIndex].duration.text
	directionSteps(jsonBody, (err, stepsArray) => {
		if (err) return callback(err)
		return callback(null, time, stepsArray)
	})
}

function directionSteps(jsonBody, callback) {
	const firstIndex = 0
	let stepsArray = []
	var keys = Object.keys(jsonBody.routes[firstIndex].legs[firstIndex].steps);
	for (var i = 0; i < keys.length; i++) {
		stepsArray[i] = jsonBody.routes[firstIndex].legs[firstIndex].steps[i].html_instructions
	}	
	return callback(null, stepsArray)
}
