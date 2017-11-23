var _coordsPorUf = {},
	_coordenadas = [],
	_coordenadasPorId = {},
	_candidatos = [],
	_candidatosPorId = {},
	_callbackCandidatos = []

function calcCandidatoId ({ ano, cargo, numero }) {
	return ano + '-' + cargo + '-' + numero
}

function callCallbacksCandidato (action, candidato) {
	_callbackCandidatos.forEach((callbackObj) => {
		callbackObj.callback.call(callbackObj.contexto, action, candidato)
	})
}

export default {

	set coordenadas(coords) {
		_coordenadas = coords
		return coords	
	},

	get coordenadas() {
		return _coordenadas
	},

	get candidatos() {
		return _candidatos
	},

	getCoordByUf (uf) {
		return _coordsByUf[uf]
	},

	adicionarCandidato (candidato) {
		if (!candidato.id)
			candidato.id = calcCandidatoId(candidato)
		if (_candidatos.indexOf(candidato) < 0)
			_candidatos.push(candidato)
		_candidatosPorId[candidato.id] = candidato
		callCallbacksCandidato('adicionar', candidato)
		return candidato
	},

	removerCandidato (candidato) {
		var index = _candidatos.indexOf(candidato)
		if (index >= 0) {
			_candidatos.splice(index, 1)
			if (candidato.id) {
				_candidatos[candidato.id] = null
			}
			callCallbacksCandidato('remover', candidato)
			return candidato
		}
		return null
	},

	obterCandidato (id) {
		return _candidatosPorId[id]
	},

	adicionarCallbackCandidatos (callback, contexto) {
		for (var index = _callbackCandidatos.length-1; index > 0; index--)
			if (_callbackCandidatos[index].callback == callback) {
				_callbackCandidatos[index].contexto = contexto
				return _callbackCandidatos[index]
			}

		var callbackObj = {	callback, contexto }
		_callbackCandidatos.push(callbackObj)
		return callbackObj 
	},

	removerCallbackCandidatos (callback) {
		for (var index = _callbackCandidatos.length-1; index >= 0; index--)
			if (_callbackCandidatos[index].callback == callback) {
				return _callbackCandidatos.splice(index, 1)
			}

		return null
	}

}