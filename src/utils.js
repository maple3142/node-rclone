function pascal2camel(name) {
	return name[0].toLowerCase() + name.slice(1)
}
exports.pascal2camel = pascal2camel
function objectKeysToCamel(obj) {
	const newObj = {}
	for (const key of Object.keys(obj)) {
		newObj[pascal2camel(key)] = obj[key]
	}
	return newObj
}
exports.objectKeysToCamel = objectKeysToCamel
