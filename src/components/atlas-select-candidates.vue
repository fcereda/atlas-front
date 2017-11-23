<template>

<div class="select-candidates">
	<v-container fluid>

		<atlas-candidate-chip
			v-for="candidato in candidatosSelecionados"
			:nome="candidato.nome"
			:partido="candidato.partido"
			:cargo="candidato.cargo"
			:ano="candidato.ano"
			:color="candidato.color"
			:loading="candidato.loading"
			@remove="removeCandidate"
		></atlas-candidate-chip>	

	    <p></p>

		<atlas-select-candidate
			:uf="uf.sigla"
			@add-candidate="addCandidate">
		</atlas-select-candidate>


	</v-container>
</div> 

</template>

<script>

import AtlasSelectCandidate from './atlas-select-candidate.vue'
import AtlasSelectUf from './atlas-select-uf.vue'
import AtlasCandidateChip from './atlas-candidate-chip.vue'
import api from '../lib/api.js'

var currentColorIndex = 0

function getNextColor () {
	var baseColors = ['deep-orange', 'indigo', 'pink', 'blue', 'purple', 'cyan', 'deep-purple', 'light-blue',
		'green', 'amber', 'lime', 'red', 'blue-grey', 'orange'];
	var color = baseColors[currentColorIndex % baseColors.length] + ' darken-' + (currentColorIndex / baseColors.length + 1)
	currentColorIndex += 1;
	return color; 	
}


export default {

	components: {
		AtlasSelectCandidate,
		AtlasSelectUf,
		AtlasCandidateChip
	},

	props: [ 'uf' ],

    data: () => ({

        headersCandidatosSelecionados: [
 		{	
 			text: '',
 			align: 'left',
 			sortable: false,
 			class: 'pa-0 pl-2 pr-2',
 			value: 'color'
 		},       
       	{
        	text: 'Nome',
        	align: 'left',
        	sortable: true,
        	value: 'nome',
        	class: "pa-0 pl-2"
    	}, { 
      		text: 'Cargo', 
      		align: 'left',
      		sortable: true,
      		value: 'cargo',
        	class: "pa-0"
        }, {
      		text: 'Ano',
      		align: 'right',
      		sortable: true,
      		value: 'ano',
      		class:"pa-0 pr-1"
        }, {
        	text: '',
        	align: 'center',
        	class:"pa-0"
        }],

    	candidatosSelecionados: [{
    		nome: 'Paulo Salim Maluf',
    		partido: 'PP',
    		cargo: 'D Federal',
    		ano: 2006,
    		votos: 1675887,
    		color: getNextColor(),
    		show: true
    	}, {
    		nome: 'Gilberto Kassab',
    		partido: 'PSD',
    		cargo: 'Senador',
    		ano: 2014,
    		votos: 567099,
    		color: getNextColor(),
    		show: true
    	}, {
    		nome: 'Luiza Erundina',
    		partido: 'PSB',
    		cargo: 'D Federal',
    		ano: 2010,
    		votos: 90001,
    		color: getNextColor(),
    		show: true
    	}, {
    		nome: 'Geraldo Alckmin',
    		partido: 'PSDB',
    		cargo: 'Governador',
    		ano: 2014,
    		votos: 35090000,
    		color: getNextColor(),
    		show: true
    	}],

    	votesData: {},

    }),

    methods: {

    	setUF (uf) {
    		console.log('setUF to ', uf)
    		this.uf = uf
    		this.$emit('change-uf', uf.sigla)
    	},

    	addCandidate: function (candidate) {

    		var color = 'black',  //'grey darken-1', //getNextColor(),
    			candidateObj = {...candidate, color, loading: true}
    		this.candidatosSelecionados.push(candidateObj)
    		api.getVotesByZoneAndCity({...candidate, uf: this.uf.sigla})
    		.then((data) => {
    			console.log(data.length +  ' rows loaded by api.getVotesByZoneAndCity')
    			console.log(data[0])
    			var votes = {}
    			data.forEach(({ codigoMunicipio, codigoZona, votos }) => {
    				var id = codigoMunicipio + '-' + ("00" + parseInt(codigoZona)).slice(-3)
    				votes[id] = {
    					id,
    					numero: votos
    				}	
    			})
    			candidateObj.loading = false
    			candidateObj.color = getNextColor()
    			this.$emit('add-candidate', {...candidateObj, votos: votes})
    		})
    		.catch((error) => {
    			console.error(error)
    		})

    	},

    	removeCandidate (candidato) {
    		var indexToRemove = this.candidatosSelecionados.indexOf(candidato);
    		if (indexToRemove >= 0) {
    			var candidate = this.candidatosSelecionados.splice(indexToRemove, 1)
    			this.$emit('remove-candidate', candidate)
    		}
    		else {
    			console.error('Error trying to remove candidate from list')
    			console.log(obj)
    		}
    	}

    },

};

</script>

<style>
.select-candidates {
	width: 100%;
	margin-top: -4px;
	overflow-y: hidden;
}	

.delete-button {
	cursor: pointer;
}

.delete-button:hover {
	color: rgb(239, 83, 80);
}

</style>
