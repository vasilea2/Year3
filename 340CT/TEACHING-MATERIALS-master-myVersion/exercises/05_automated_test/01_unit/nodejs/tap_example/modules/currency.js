
// Ussage: "node currency <apiKey> <currency>"
// example: node currency 1234sdpdApiKey USD

const request = require('request')

var apiKey = process.argv[2];
var toCurrency = process.argv[3];

let url = `http://data.fixer.io/api/latest?access_key=${apiKey}`;
if (toCurrency !== "" ) url += `&symbols=${toCurrency}&format=1`;

request(url, {json: true}, (err, res, body) => {
	if (err) return console.log(err);
	myValue = Number.parseFloat(body.rates[`${toCurrency}`]).toFixed(2)
	console.log('1 EUR = ' + myValue + " " + toCurrency);
})


// exports.convert = (base, to, amt, callback) => {
// 	const url = `https://api.fixer.io/latest?base=${base}&symbols=${to}`
// 	request.get(url, (err, res, body) => {
// 		data = JSON.parse(body)
// 		//console.log(typeof(data))
// 		//console.log(data)
// 		const multiplier = data.rates[to]
// 		callback(amt * multiplier)
// 	})
// }

/* API response format.
{
  "base": "GBP",
  "date": "2017-11-10",
  "rates": {
    "USD": 1.3188
  }
}
*/