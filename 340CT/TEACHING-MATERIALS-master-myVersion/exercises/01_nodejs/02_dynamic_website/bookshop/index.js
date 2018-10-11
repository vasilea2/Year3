#!/usr/bin/env node

'use strict'

const express = require('express')

const handlebars = require('express-handlebars').create({defaultLayout: 'main'})
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use(express.static('css'))
app.use(bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

const port = 8080

const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./bookshop.db', (err) => {
	if (err) return console.error(err.message)
	console.log('Connected to the "bookshop.db" SQlite database.')
})

app.get('/oldindex', async(req, res) => {
	const sql = 'SELECT * FROM books;'
	console.log(sql)
	db.all(sql, (err, data) => {
		if(err) console.error(err.message)
		console.log(JSON.stringify(data, null, 2))
		res.render('home', {books: data})
	})
})

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
			OR upper(publisher) LIKE upper("%${req.query.q}%")`
//       OR year = CAST("${req.query.q}" AS INTEGER);`
// 		q = ${req.query.q}
	}
  
  let queryInt = parseInt(req.query.q, 10) 
  if (isNaN(queryInt)) {
    console.log("Not an int");
    sql += ";"
  } else {
    sql += ` OR publication_year = ${queryInt};` 
  }
    
	// --------
	db.all(sql, (err, data) => {
		if(err) console.error(err.message)
		let list = '<ol>'
		for(const book of data) {
			list += `<li>${book.id}:${book.title}</br>${book.description}</br></li>`
		}
		if (req.query.q !== undefined) {
      resultString = data.length + " results for searching '" + req.query.q + "'"
		}
		list += '</ol>'
		// --------
		res.render('newindex', {books: data, result: resultString, query: q})
		// --------
	})
})

app.get('/details/:id', (req, res) => {
	console.log(req.params.id)
	const sql = `SELECT * FROM books WHERE id = ${req.params.id};`
	console.log(sql)
	const q = req.query.q
  console.log(q)
	db.get(sql, (err, data) => {
		if(err) console.error(err.message)
		data.description = data.description.replace(/\n/g, "</p><p>")
		res.render('details', {data: data, query: q})
	})
})

app.get('/form', async(req, res) => res.render('form'))

app.post('/add', async(req, res) => {
	console.log(req.body)
	const sql = `INSERT INTO books(title, isbn, description, author, publisher, publication_year)
				VALUES("${req.body.title}", ${req.body.isbn}, "${req.body.description}", "${req.body.author}", "${req.body.publisher}", ${req.body.year});`
	console.log(sql)
	db.run(sql, err => {
		if(err) console.error(err.message)
		res.redirect('/')
	})
})

app.listen(port, () => console.log(`app listening on port ${port}`))
