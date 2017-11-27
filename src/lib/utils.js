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

	},

	formatInt (num) {
		var thisNum = num,
			str = ''

		do {
			let centenas = ('00' + (thisNum % 1000)).slice(-3)
			str = centenas + (str ? '.' + str : '') 
			thisNum = Math.floor(thisNum / 1000)
		} while (thisNum)

		return str.replace(/^0{1,2}/gm, '')

	}

}