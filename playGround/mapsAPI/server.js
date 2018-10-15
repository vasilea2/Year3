#!/usr/bin/env node

'use strict'

// AIzaSyAo852tvZq6wAfDwqpBSnLMZYBZOFArL_c
const apiKey = process.argv[2];
const addressInput = process.argv[3];

// import dependencies (npm install <name>)
var express = require('express');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'})    // render main.handlebar
const googleMapsClient = require('@google/maps').createClient({key: apiKey});

// initiate application using express and set listening port
var app = express();
var port = 8080;

// import directories
app.use(express.static('public'))
app.use(express.static('css'))

// using express engine and the handlebar views
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

// foundation route
app.get('/', (req, res) => {

    let address = ''
    let latitude = ''
    let longitude = ''

    if (apiKey === '') {
        console.error('Please enter an ApiKey')
        process.exit()
    }

    googleMapsClient.geocode({address: addressInput}, function(err, response) {
        if (err) console.error(err)
        if (res.statusCode < 200 && res.statusCode > 300) throw('Wrong status code: ' + res.statusCode)
        if (response.json.status === 'ZERO_RESULTS') {
            console.error('Address is not found')
            res.render('home', {addr: 'Address was not found for "' + addressInput + '"', lat: latitude, lng: longitude})
            // process.exit()
        } else {
            address = response.json.results[0].formatted_address
            latitude = parseFloat(response.json.results[0].geometry.bounds.northeast.lat).toFixed(4)
            longitude = parseFloat(response.json.results[0].geometry.bounds.northeast.lng).toFixed(4)

            res.render('home', {addr: 'Full addres: ' +  address, lat: 'Latitude: ' + latitude, lng: 'Longitude: ' + longitude})
        }
    });


})

// start server and listen on ${port}
app.listen(port, () => console.log(`listening on port ${port}`));