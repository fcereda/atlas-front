import axios from 'axios'


// Aux functions, private to this module

function getCargoETurno (cargo, uf) {

	const CARGOS_E_TURNOS = {
		'pr1': {
			cargo: 1,
			turno: 1
		}, 
		'pr2': {
			cargo: 1,
			turno: 2,
		},
		'g1': {
			cargo: 3,
			turno: 1,
		},
		'g2': {
			cargo: 3,
			turno: 2
		},
		's': {
			cargo: 5,
			turno: 1
		},
		'df': {
			cargo: 6,
			turno: 1
		},
		'de': {
			cargo: uf == 'DF' ? 8 : 7,
			turno: 1
		},
		'pm1': {
			cargo: 11,
			turno: 1
		},
		'pm2': {
			cargo: 11,
			turno: 2,
		},
		'v': {
			cargo: 13,
			turno: 1
		}
	}		

	return CARGOS_E_TURNOS[cargo]

}	


function addQuery (query, key, value) {
	if (query)
		query = query + '&'
	else
		query = ''
	return query + key + '=' + value
}

function buildSearchQuery (key, value, position) {
	var column = 'columns[' + position + ']'
	var query = column + '[name]=' + key
	query = query + '&' + column + '[search][value]=' + value
	return query
}


export default {
	
	getVotesByZoneAndCity ({ ano, uf, cargo, numero }) {
		var cargoETurno = getCargoETurno(cargo, uf)
		cargo = cargoETurno.cargo
		var turno = cargoETurno.turno
		var query = addQuery(null, 'cargo', cargo)
		query = addQuery(query, 'agregacao_politica', 1) 
		query = addQuery(query, 'agregacao_regional', 7)
		query = query + '&' + buildSearchQuery('UF', uf, 0)
		query = query + '&' + buildSearchQuery('NUMERO_CANDIDATO', numero, 1)

		alert(query);

		return query;

// http://cepesp.io/api/consulta/votos?cargo=1&ano=2010&agregacao_politica=1&agregacao_regional=7&columns[0][name]=UF&columns[0][search][value]=SP&columns[1][name]=NUMERO_CANDIDATO&columns[1][search][value]=45&columns[2][name]=COD_MUN_TSE&colmns[2][search][value]=71072&selected_columns[0]=%22NUM_ZONA%22&selected_columns[1]=%22QTDE_VOTOS%22


	}
}