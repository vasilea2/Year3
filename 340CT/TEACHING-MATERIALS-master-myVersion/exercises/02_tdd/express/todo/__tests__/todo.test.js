
'use strict'

/* eslint-disable no-magic-numbers */

const todo = require('../modules/todo')

describe('add', () => {

	//beforeEach( () => todo.add('bread', 1))
	afterEach( () => todo.clear())

	test('check there is a single item', done => {
		expect.assertions(1)
		todo.add('bread', 1)
		const items = todo.getAll()
		expect(items.length).toBe(1)
		done()
	})

	test('adding a single item', () => {
		expect.assertions(1)
		todo.add('bread', 1)
		const items = todo.getAll()
		expect(items.length).toBe(1)
	})

	test('adding an empty item string', () => {
		expect.assertions(1)
		try {
			todo.add('bread', 1)
			todo.add('', '')
		} catch(err) {
			expect(err.message).toBe('item is blank string')
		}
	})

	test('adding a non-integer quantity', () => {
		expect.assertions(1)
		try {
			const myIndex = 1
			todo.add('bread', 1)
			todo.add('flour', 'one')
			const items = todo.getAll()
			console.log(items[myIndex].qty)
			expect(items[myIndex].qty).toEqual(jasmine.any(Number))
		} catch(err) {
			expect(err.message).toBe('quantity is non-integer')
		}
	})

	test('adding an empty quantity', () => {
		expect.assertions(1)
		try {
			const myIndex = 1
			todo.add('bread', 1)
			todo.add('flour', '')
			const items = todo.getAll()
			expect(items[myIndex].qty).toEqual(0)
		} catch(err) {
			expect(err.message).toBe('quantity is empty')
		}	
	})

})

describe('clear', () => {

	test('clear list with items', () => {
		expect.assertions(2)
		try {
			todo.add('bread', 1)
			todo.add('butter', 2)
			const data = todo.getAll()
			expect(data.length).toBe(2)
			todo.clear()
			todo.getAll()
		} catch(err) {
			expect(err.message).toBe('empty list')
		}
	})

	test('clearing empty list should throw error', () => {
		expect.assertions(1)
		try {
			todo.clear()
		} catch(err) {
			expect(err.message).toBe('trying to clear empty list')
		}
	})

})

describe('getAll', () => {

	test('retrieving a single item', () => {
		expect.assertions(2)
		todo.add('bread', 1)
		const items = todo.getAll()
		expect(Array.isArray(items)).toBeTruthy()
		expect(items.length).toBe(1)
	})

	test('retrieving empty list should throw an error', () => {
		expect.assertions(1)
		try {
			todo.clear()
			todo.getAll()
		} catch(err) {
			expect(err.message).toBe('empty list')
		}
	})

	test('retrieving list with duplicate items', () => {
		expect.assertions(2)
		try {
			const myQty = 1
			const myIndex = 0
			todo.add('bread', myQty)
			todo.add('bread', myQty)
			const items = todo.getAll()
			expect(items.length).toBe(1)
			expect(items[myIndex].qty).toBe(2*myQty)
			todo.clear()
		} catch(err) {
			expect(err.message).toBe('list has duplicate item names')
		}
	})

	test ('retrieving list with low level duplicates (same item, different case)', () => {
		expect.assertions(1)
		try {
			todo.add('bread', 7)
			todo.add('bREad', 3)
			const items = todo.getAll()
			expect(items.length).toBe(1)
			todo.clear()
		} catch(err) {
			expect(err.message).toBe('item found twice using different case')
		}
	})

})

describe('delete', () => {

	beforeEach( () => todo.add('bread', 1))
	afterEach( () => todo.clear())

	test ('delete one item from the list', () => {
		expect.assertions(1)
		try {
			const myIndex = 1
			todo.add('cookie', 2)
			const items = todo.getAll()
			todo.delete(myIndex)
			expect(items.length).toBe(1)
		} catch(err) {
			expect(err.message).toBe('failed to delete one item')
		}
	})

	test ('delete an inexistent key from the list', () => {
		try {
			const wrongIndex = 3
			todo.add('cookie', 2)
			const items = todo.getAll()
			todo.delete(wrongIndex)
			expect(items.length).toBe(2)
		} catch(err) {
			expect(err.message).toBe('deleting an inexistent index')
		}
	})

	test ('input is not an integer (is string)', () => {
		try {
			const wrongIndex = "asd"
			todo.add('cookie', 2)
			const items = todo.getAll()
			todo.delete(wrongIndex)
			expect(items.length).toBe(2)
		} catch(err) {
			expect(err.message).toBe('deleting using a string key')
		}
	})

	test ('input is not an integer (is float)', () => {
		try {
			const wrongIndex = 0.7
			todo.add('cookie', 2)
			const items = todo.getAll()
			todo.delete(wrongIndex)
			expect(items.length).toBe(2)
		} catch(err) {
			expect(err.message).toBe('deleting using a float key')
		}
	})

	test ('input is negative number', () => {
		try {
			const wrongIndex = -0.2
			todo.add('cookie', 2)
			const items = todo.getAll()
			todo.delete(wrongIndex)
			expect(items.length).toBe(2)
		} catch(err) {
			expect(err.message).toBe('deleting using a negative key')
		}
	})
})