'use strict'

var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
const fs = require('fs')
var parse = require('csv-parse')

router.use(function (req, res, next) {
	console.log(req.path);
	next();
});			

var arqCandidatos = './data/candidatos.csv',
	arqCoords = './data/coords.csv',
	port = 8008,
	verbose = false,
 	candidatos = [],
	coordsArray = [],
	coordenadas = {},
	coordenadasPorUf = {}

function getOptions () {
	const commandLineArgs = require('command-line-args')
 
	const optionDefinitions = [
	  { name: 'verbose', alias: 'v', type: Boolean, help: 'Modo verboso' },
	  { name: 'port', alias: 'p', type: Number, multiple: false, defaultOption: 8000, help: 'A porta à qual o servidor vai responder. Default é 8000' },
	  { name: 'candidatos', alias: 'a', type: String, defaultOption: './data/candidatos.csv', help: 'Nome do arquivo de candidatos. Default é ./data/candidatos.csv' },
	  { name: 'coords', alias: 'c', type: String, defaultOption: './data/coords.csv', help: 'Nome do arquivo de coordenadas. Default é ./data/coords.csv' }
	]

	var options = commandLineArgs(optionDefinitions, {partial: true})
	if (options._unknown) {
		console.log('Servidor do CEPESP Atlas Eleitoral')
		console.log('Opcões:')
		optionDefinitions.forEach((definition) => console.log('    --' + definition.name + ' ou -' + definition.alias + ': ' + definition.help))
		process.exit();
	}
	return options;
}

function print () {
	console.log.apply(this, arguments)
}

function verboseprint () {
	if (verbose)
		console.log.apply(this, arguments)
}


function filterCandidates (uf, ano, cargo, nome) {
	return candidatos.filter((candidato) => {
		if (uf && candidato.uf != uf)
			return false;
		if (ano && candidato.ano != ano)
			return false;
		if (cargo && candidato.cargo != cargo)
			return false;
		if (nome && candidato.nome.indexOf(nome) < 0)
			return false;
		return true;
	});
}

router.route('/api/candidatos')
	.get(function (req, res) {
		var { uf, ano, cargo, nome } = req.query;
		if (cargo == 'pr1' || cargo == 'pr2')
			uf = null
		if (uf)
			uf = uf.toUpperCase()
		if (nome)
			nome = nome.toUpperCase();
		return res.json(filterCandidates(uf, ano, cargo, nome))
	})

router.route('/api/coordenadas')
	.get(function (req, res) {
		var { id, uf } = req.query
		if (id)
			return res.json(coordenadas[id])
		if (uf) {
			print('uf = ' + uf)
			print(coordenadasPorUf[uf.toUpperCase()])
			return res.json(coordenadasPorUf[uf.toUpperCase()])
		}
		return res.status(400).json({ error: 'Please specify ID or UF' })
	})
	

function parseCandidateRow (row) {

	const cargos = ['pr', 'vpr', 'g', 'vg', 's', 'df', 'de', 'de', '1s', '2s']

	var nome = row[6],
		uf = row[2],
		ano = row[0],
		partido = row[9],
		cargo = cargos[parseInt(row[4]) - 1],
		numero = parseInt(row[7])
	if (cargo == 'pr' || cargo == 'g')
		cargo = cargo + row[1]
	return {
		nome,
		uf,
		ano,
		partido,
		cargo,
		numero,
		id: uf + '-' + ano + '-' + cargo + '-' + numero
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
verbose = options.verbose || verbose

print('Servidor do CEPESP Atlas Eleitoral')

print('Loading candidates...')
var fileName = arqCandidatos
try {
	var fileData = fs.readFileSync(fileName);
    parse(fileData, {delimiter: ',', trim: true, from: 2}, function (err, rows) {
    	if (err) {
    		console.error(`Error trying to parse file {fileName}`)
    		process.exit()
    	}
 		print(rows.length + ' candidatos carregados');
    	candidatos = rows.map((row) => parseCandidateRow(row))
  	})
}  	
catch (error) {
	console.error('Error trying to open file ' + fileName)
	process.exit()
}

console.log('Loading coordinates...')
fileName = arqCoords
try {
	var fileData = fs.readFileSync(fileName);
	parse(fileData, {delimiter: ',', trim: true, from: 2}, function (err, rows) {
		if (err) {
    		console.error(`Error trying to parse file {fileName}`)
    		process.exit()
    	}
    	console.log(rows.length + ' coordenadas carregadas')
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
    	print('Servidor do CEPESP Atlas Eleitoral operando na porta ' + port);
	});
}
catch (error) {
	console.log('Error trying to open file ' + fileName)
	process.exit()
}


app.use('', router);
app.listen(port);






