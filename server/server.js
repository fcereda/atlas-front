var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
const fs = require('fs')
var parse = require('csv-parse')

const port = 8008;

router.use(function (req, res, next) {
	console.log(req.path);
	next();
});			

var candidatos = [];

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
			uf = null;
		if (uf)
			uf = uf.toUpperCase();
		if (nome)
			nome = nome.toUpperCase();
		return res.json(filterCandidates(uf, ano, cargo, nome));	
	});
	

function parseRow (row) {

	const cargos = ['pr', 'vpr', 'g', 'vg', 's', 'df', 'de', 'de', '1s', '2s']

	var nome = row[6],
		uf = row[2],
		ano = row[0],
		partido = row[9],
		cargo = cargos[parseInt(row[4]) - 1]
	if (cargo == 'pr' || cargo == 'g')
		cargo = cargo + row[1]
	return {
		nome,
		uf,
		ano,
		partido,
		cargo
	}
}	

console.log('Loading candidates...')
fs.readFile('./candidatos.csv', function (err, fileData) {
  parse(fileData, {delimiter: ',', trim: true}, function(err, rows) {
  	console.log(rows.length + ' candidates loaded');
    candidatos = rows.map((row) => parseRow(row))
    console.log(candidatos)
  })
})


app.use('', router);
app.listen(port);
console.log('Hiline server listening on port ' + port);

