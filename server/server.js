'use strict'

var express = require('express')
var app = express()
var router = express.Router()
var bodyParser = require('body-parser')
const fs = require('fs')
var parse = require('csv-parse')
var proxy = require('express-http-proxy')
var path = require('path');

var arqCandidatos = './data/candidatos.csv',
	arqCoords = './data/coords.csv',
	arqPartidos = './data/partidos.json',
	arqMunicipios = './data/municipios.csv',
	port = 8008,
	verbose = false,
	debugMode = false,
	developmentMode = false,
	distFolder = __dirname + '/dist/',
	publicFolder = __dirname + '/public/',
 	candidatos = [],
 	candidatosPorUf = {},
	coordsArray = [],
	coordenadas = {},
	coordenadasPorUf = {},
	municipios = [],
	municipiosPorUf = {},
	partidos = []

router.use(function (req, res, next) {
	if (debugMode) {
		console.log(req.path)
	}	
	next()
})	

function getOptions () {
	const commandLineArgs = require('command-line-args')
 
	const optionDefinitions = [
	  { name: 'verbose', alias: 'v', type: Boolean, help: 'Modo verboso' },
	  { name: 'debug', alias: 'd', type: Boolean, help: 'Modo de depuração'},
	  { name: 'port', alias: 'p', type: Number, multiple: false, defaultOption: 8000, help: 'A porta à qual o servidor vai responder. Default é 8000' },
	  { name: 'candidatos', alias: 'a', type: String, defaultOption: './data/candidatos.csv', help: 'Nome do arquivo de candidatos. Default é ./data/candidatos.csv' },
	  { name: 'coords', alias: 'c', type: String, defaultOption: './data/coords.csv', help: 'Nome do arquivo de coordenadas. Default é ./data/coords.csv' },
	  { name: 'partidos', alias: 't', type: String, defaultOption: './data/partidos.json', help: 'Nome do arquivo de partidos políticos. Default é ./data/partidos.json'},
	  { name: 'municipios', alias: 'm', type: String, defaultOption: './data/municipios.json', help: 'Nome do arquivo de dados do IBGE dos municípios. Default é ./data/municipios.csv'},
	  { name: 'dev', type: Boolean, help: 'True durante o desenvolvimento' }
	]

	var options = commandLineArgs(optionDefinitions, {partial: true})
	if (options._unknown) {
		print('Servidor do CEPESP Atlas Eleitoral')
		print('Opcões:')
		optionDefinitions.forEach((definition) => console.log('    --' + definition.name + ' ou -' + definition.alias + ': ' + definition.help))
		process.exit()
	}
	return options
}

function print () {
	console.log.apply(this, arguments)
}

function verboseprint () {
	if (verbose)
		console.log.apply(this, arguments)
}


function filterCandidates (arrayCandidatos, uf, ano, cargo, nome, partido) {
	return arrayCandidatos.filter((candidato) => {
		if (uf && candidato.uf != uf)
			return false
		if (ano && candidato.ano != ano)
			return false
		if (cargo && candidato.cargo != cargo)
			return false
		if (nome && candidato.nome.indexOf(nome) < 0)
			return false
		if (partido && candidato.partido != partido)
			return false
		return true
	})
}


if (!developmentMode) {
	app.get('/', function (req, res) {
	    res.sendFile(path.join(distFolder + 'index.html'))
	});

	app.get('/dist/build.js', function (req, res) {
		res.sendFile(path.join(distFolder + 'build.js'))
	})

	app.use('/public', express.static(publicFolder));

	app.use('/cepesp', proxy('http://cepesp.io/'))
}
else {
	console.log('Operando em modo de desenvolvimento')
}


router.route('/api/candidatos')
	.get(function (req, res) {
		var { uf, ano, cargo, nome, partido } = req.query
		//if (cargo == 'pr1' || cargo == 'pr2')
		//	uf = null
		var arrayAFiltrar = []
		if (uf)
			uf = uf.toUpperCase()
		try {
			if (uf && ano && cargo)
				arrayAFiltrar = candidatosPorUf[uf][ano][cargo]
			else if (uf && ano)
				arrayAFiltrar = candidatosPorUf[uf][ano]
			else if (uf && cargo)
				arrayAFiltrar = candidatosPorUf[uf][cargo]
			else if (uf)
				arrayAFiltrar = candidatosPorUf[uf]
			else
				arrayAFiltrar = candidatos
		}
		catch (err) {
			if (debugMode) {
				print(err)
			}
			arrayAFiltrar = []
		}	
		if (nome)
			nome = nome.toUpperCase()
		return res.json(filterCandidates(candidatos, uf, ano, cargo, nome, partido))
	})

router.route('/api/partidos')
	.get(function (req, res) {
		res.json(partidos)
	})

router.route('/api/coordenadas')
	.get(function (req, res) {
		var { id, uf } = req.query
		if (id)
			return res.json(coordenadas[id])
		if (uf) {
			return res.json(coordenadasPorUf[uf.toUpperCase()])
		}
		return res.status(400).json({ error: 'Please specify ID or UF' })
	})
	
router.route('/api/municipios')	
	.get(function (req, res) {
		var { id, uf } = req.query
		if (uf) {
			uf = uf.toUpperCase()
			if (!municipiosPorUf[uf])
				return res.status(400).json({ error: 'UF ' + uf + ' does not exist'})
			return res.json(municipiosPorUf[uf])
		}	
		else {
			var ufs = []
			for (var uf in municipiosPorUf)
				ufs.push(uf)
			return res.json(ufs)
		}
		return res.status(400).json({ error: 'Please specify ID or UF' })
	})



function parseCandidateRow (row) {

	const cargos = ['pr', 'vpr', 'g', 'vg', 's', 'df', 'de', 'de', '1s', '2s', 'pm', 'vpm', 'vm']

	var nome = row['NOME_CANDIDATO'],
		uf = row['UF'] || row['SIGLA_UF'],
		ano = row['ANO_ELEICAO'],
		partido = row['SIGLA_PARTIDO'],
		cargo = cargos[parseInt(row['CODIGO_CARGO']) - 1],
		numero = parseInt(row['NUMERO_CANDIDATO']),
		classificacao = parseInt(row['CLASSIFICACAO'] || -1),
		votacao = parseInt(row['QTDE_VOTOS'])

	if (cargo == 'pr' || cargo == 'g')
		cargo = cargo + row['NUM_TURNO']
	return {
		nome,
		uf,
		ano,
		partido,
		cargo,
		numero,
		id: uf + '-' + ano + '-' + cargo + '-' + numero,
		classificacao,
		votacao
	}
}	


function parseCoordinateRow (row) {
	var id = row[0],
	uf = row[1],
		municipio = row[2],
		zona = row[3],
		lat = row[4],
		long = row[5],
		codTse = row[6]
	return {
		id,
		uf,
		municipio,
		zona,
		lat,
		long,
		codTse
	}
}


var options = getOptions()
port = options.port || port
arqCandidatos = options.candidatos || arqCandidatos
arqCoords = options.coords || arqCoords
arqMunicipios = options.municipios || arqMunicipios
verbose = options.verbose || verbose
debugMode = options.debug || debugMode
developmentMode = options.dev || developmentMode

print('Servidor do CEPESP Atlas Eleitoral')
print('Carregando candidatos...')
try {
	var fileData = fs.readFileSync(arqCandidatos)
    parse(fileData, {delimiter: ',', trim: true, columns: true}, function (err, rows) {
    	if (err) {
    		console.error(`Error trying to parse file ${arqCandidatos}`)
    		console.error(err)
    		process.exit()
    	}
 		print(rows.length + ' candidatos carregados')
    	candidatos = rows
    		.filter((row) => parseInt(row['CODIGO_CARGO']) <= 8)	// Elimina todos os prefeitos e vereadores
    		.map((row) => parseCandidateRow(row))

    	candidatos.forEach((candidato) => {
    		var {uf, ano, cargo} = candidato
    		if (!candidatosPorUf[uf])
    			candidatosPorUf[uf] = {}
    		if (!candidatosPorUf[uf][cargo])
    			candidatosPorUf[uf][cargo] = []
    		if (!candidatosPorUf[uf][ano])
    			candidatosPorUf[uf][ano] = {}		// Note que a propriedade ano é uma string
    		if (!candidatosPorUf[uf][ano][cargo])
    			candidatosPorUf[uf][ano][cargo] = []
    		candidatosPorUf[uf][ano][cargo].push(candidato)
    		candidatosPorUf[uf][cargo].push(candidato) 
    	})	

    	var sumarioCandidato = ({ numero,nome,votacao }) => numero + ' ' + nome + ', ' + votacao + ' votos'

    	if (debugMode) {
	    	print('todos os candidatos a presidente:')
	    	console.log(candidatosPorUf['SP']['pr1']
	    		.sort((a, b) => (a.ano * 100 + a.numero) - (b.ano * 100 + b.numero))
	    		.map(sumarioCandidato))
	    	console.log('candidatos a governador em 2014')
	    	console.log(candidatosPorUf['SP'][2014]['g1']
	    		.map(sumarioCandidato))
	    }	

  	})
}  	
catch (error) {
	console.error('Erro tentando abrir o arquivo ' + arqCandidatos)
	console.error(error)
	process.exit()
}

print('Carregando partidos políticos...')
try {
	var partidos = JSON.parse(fs.readFileSync(arqPartidos, 'utf8'));
}
catch (error) {
	console.error('Erro tentando abrir o arquivo ' + arqPartidos)
	console.error(error)
	process.exit()
}

print('Carregando coordenadas...')
try {
	var fileData = fs.readFileSync(arqCoords)
	parse(fileData, {delimiter: ',', trim: true, from: 2}, function (err, rows) {
		if (err) {
    		console.error(`Error trying to parse file ${arqCoords}`)
    		process.exit()
    	}
    	print(rows.length + ' coordenadas carregadas')
    	coordsArray = rows.map((row) => parseCoordinateRow(row))
    	coordenadas = coordsArray.reduce((coordenadas, coord) => {
			var id = coord.id
    		coordenadas[id] = coord
    		return coordenadas
    	}, {})
    	coordenadasPorUf = coordsArray.reduce((coordsPorUf, coordenada) => {
    		let uf = coordenada.uf.toUpperCase()
    		if (!coordsPorUf[uf])
    			coordsPorUf[uf] = [coordenada]
    		else
    			coordsPorUf[uf].push(coordenada) 
    		return coordsPorUf
    	}, {})
    	if (verbose)
    		Object.entries(coordenadasPorUf).forEach(([uf, coords]) => print(uf + ': ' + coords.length + ' coordenadas carregadas'))
    	// We assume this will be the last line to be executed when all data files are loaded
    	print('Servidor do CEPESP Atlas Eleitoral operando na porta ' + port)
	})
}
catch (error) {
	console.error('Erro tentando abrir o arquivo ' + fileName)
	console.error(error)
	process.exit()
}


function parseIbgeData (row) {
	var newObj = {}
	for (var key in row) {
		if (key == 'id' || key == 'uf' || key == 'nome')
			newObj[key] = row[key]
		else
			newObj[key] = parseFloat(row[key])
	}
	return newObj
}

print('Carregando dados IBGE dos municípios...')
try {
	var fileData = fs.readFileSync(arqMunicipios)
	parse(fileData, {delimiter: ';', trim: true, columns: true}, function (err, rows) {
    	if (err) {
    		console.error(`Error trying to parse file ${arqMunicipios}`)
    		console.error(err)
    		process.exit()
    	}
 		print(rows.length + ' municípios carregados')
    	municipios = rows.map(parseIbgeData)

    	municipiosPorUf = {}
    	municipios.forEach((municipio) => {
    		let uf = municipio.uf.toUpperCase()
    		if (!municipiosPorUf[uf])
    			municipiosPorUf[uf] = []
    		municipiosPorUf[uf].push(municipio)
		})    		
	})
}
catch (error) {
	console.error('Erro tentando abrir o arquivo ' + fileName)
	console.error(error)
	process.exit()
}


app.use('', router)
app.listen(port)






