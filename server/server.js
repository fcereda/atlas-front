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
		if (uf)
			uf = uf.toUpperCase();
		if (nome)
			nome = nome.toUpperCase();
		return res.json(filterCandidates(uf, ano, cargo, nome));	
	});
	

console.log('Loading candidates...')
fs.readFile('./candidatos.csv', function (err, fileData) {
  parse(fileData, {delimiter: ',', trim: true}, function(err, rows) {
  	console.log(rows.length + ' candidates loaded');
    rows.forEach((row) => {
    	var candidato = {
    		nome: row[6],
    		uf: row[2],
    		ano: row[0],
    		partido: row[9]
    	};
    	candidatos.push(candidato);
    })
  })
})


app.use('', router);
app.listen(port);
console.log('Hiline server listening on port ' + port);

