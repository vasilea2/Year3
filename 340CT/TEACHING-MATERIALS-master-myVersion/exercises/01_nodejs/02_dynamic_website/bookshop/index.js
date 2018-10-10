#!/usr/bin/env node

'use strict'

const express = require('express')

const handlebars = require('express-handlebars').create({defaultLayout: 'main'})
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

const port = 8080

const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./bookshop.db', (err) => {
	if (err) return console.error(err.message)
	console.log('Connected to the "bookshop.db" SQlite database.')
})

// app.get('/', async(req, res) => {
// 	const sql = 'SELECT * FROM books;'
// 	console.log(sql)
// 	db.all(sql, (err, data) => {
// 		if(err) console.error(err.message)
// 		console.log(JSON.stringify(data, null, 2))
// 		res.render('home', {books: data})
// 	})
// })

app.get('/', async(req, res) => {
	let sql = 'SELECT id, title, description FROM books;'
	// --------
	let q = ''
	let resultString = 'This is the full list of books'
	if(req.query !== undefined && req.query.q !== undefined) {
		sql = `SELECT id, title FROM books 
			WHERE upper(title) LIKE upper("%${req.query.q}%") 
			OR upper(description) LIKE upper("%${req.query.q}%")
			OR upper(author) LIKE upper("%${req.query.q}%")
			OR upper(publisher) LIKE upper("%${req.query.q}%");`
		q = req.query.q
	}
	// --------
	db.all(sql, (err, data) => {
		if(err) console.error(err.message)
		let list = '<ol>'
		for(const book of data) {
			list += `<li>${book.id}:${book.title}</br>${book.description}</br></li>`
		}
		if (req.query.q !== undefined) {
			resultString = data.length + " results for searching '" + q + "'"
			data.forEach(function (value, i) {
				data[i].query = q
			})
			// for (const book of data) 
			// data[0].query = "node"
			console.log(data[2].query)
		}
		list += '</ol>'
		// --------
		res.render('newindex', {books: data, result: resultString, locals: {query: q}})
		// --------
	})
})

app.get('/details/:query/:id', (req, res) => {
	console.log(req.params.id)
	const sql = `SELECT * FROM books WHERE id = ${req.params.id};`
	console.log(sql)
	let q = req.params.query
	db.get(sql, (err, data) => {
		if(err) console.error(err.message)
		data.description = data.description.replace(/\n/g, "</p><p>")
		res.render('details', {data: data, query: q})
	})
})

app.get('/form', async(req, res) => res.render('form'))

app.post('/add', async(req, res) => {
	console.log(req.body)
	const sql = `INSERT INTO books(title, isbn, description)
				VALUES("${req.body.title}", "${req.body.isbn}", "${req.body.description}");`
	console.log(sql)
	db.run(sql, err => {
		if(err) console.error(err.message)
		res.redirect('/')
	})
})

app.listen(port, () => console.log(`app listening on port ${port}`))
