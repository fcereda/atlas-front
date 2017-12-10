const CARGOS_CURTO = {
	'pr1': 'Presidente T1',
	'pr2': 'Presidente T2',
	'g1' : 'Governador T1',
	'g2' : 'Governador T2',
	's'  : 'Senador',
	'df' : 'D Federal',
	'de' : 'D Estadual',
	'dd' : 'D Distrital',
	'pm1': 'Prefeito T1',
	'pm2': 'Prefeito T2',
	'v'	 : 'Vereador'
}

const CARGOS = {
	'pr1': 'Presidente 1º turno',
	'pr2': 'Presidente 2º turno',
	'g1' : 'Governador 1º turno',
	'g2' : 'Governador 2º turno',
	's'  : 'Senador',
	'df' : 'Deputado Federal',
	'de' : 'Deputado Estadual',
	'dd' : 'Deputado Distrital',
	'pm1': 'Prefeito 1º turno',
	'pm2': 'Prefeito 2º turno',
	'v'	 : 'Vereador'
}


export default {

	capitalizeName (name) {

		const exclusions = [
			'E', 'DA', 'DE', 'DO', 'DAS', 'DOS'
		]

		var words = name.split(' ')
		return words.map((word) => {
			word = word.toUpperCase();
			if (word.length <= 3 && exclusions.indexOf(word) >= 0)
				return word.toLowerCase()

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

	},

	obterNomeCargo (codigoCargo, curto) {

		return curto ? CARGOS_CURTO[codigoCargo] : CARGOS[codigoCargo]

	},	

	obterCargos (curto) {
		var cargosArray = [],
			objBase = curto ? CARGOS_CURTO : CARGOS
		for (var id in objBase) {
			cargosArray.push({
				id,
				name: CARGOS[id]
			})
		}
		return cargosArray.slice(0,8)	// Por enquanto, vamos ignorar os cargos municipais
	}

}