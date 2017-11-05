export default {

	capitalizeName (name) {

		const exclusions = [
			'E', 'DA', 'DE', 'DO', 'DAS', 'DOS'
		]

		var words = name.split(' ')
		return words.map((word) => {
			if (word.length <= 3 && exclusions.indexOf(word) >= 0)
				return word.toLowerCase()

			word = word.toUpperCase();
			return word.substr(0, 1).toUpperCase() + word.substr(1, word.length-1).toLowerCase()
		}).join(' ')

	}

}