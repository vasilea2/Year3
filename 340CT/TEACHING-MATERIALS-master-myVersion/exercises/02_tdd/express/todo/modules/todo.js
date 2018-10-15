
'use strict'

let data = []

module.exports.clear = () => {
	if(data.length === 0) throw new Error('trying to clear empty list')
	data = []
}

module.exports.add = (item, qty) => {
	if (item.length === 0) throw new Error('item is blank string')
	if (isNaN(qty)) throw new Error('quantity is non-integer')
	if (qty === '') {
		qty = 0
		console.log('quantity is empty')
	}
	data.push({item: item.toLowerCase(), qty: qty})
}

module.exports.getAll = () => {
	if(data.length === 0) throw new Error('empty list')
	for(const key in data) data[key].key = key

	// Remove duplicate item names, adding up the quantity to the lower key one
	let sameItems = []
	for (const index in data) {
		let tmpItem = data[index].item
		if (sameItems.length === 0) sameItems.push(tmpItem)
		else if (sameItems.includes(tmpItem) === false) sameItems.push(tmpItem)
		else for (let j = 0; j < index; j++) if (data[j].item === tmpItem) {
			data[j].qty = parseInt(data[j].qty, 10)
			data[index].qty = parseInt(data[index].qty, 10)			
			data[j].qty += data[index].qty
			data.splice(-1, 1)
		}
	}	
	return data
}

module.exports.delete = key => {
	data.splice(key, 1)
	if (isNaN(key)) throw new Error('deleting using a string key')
	if (key < 0) throw new Error('deleting using a negative key')
	const floatCheck = (key % 1 === 0)
	if (floatCheck === false) throw new Error('deleting using a float key')
	if (key > data.length) throw new Error('deleting an inexistent index')
	return
}
