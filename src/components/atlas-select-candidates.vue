<template>

<div class="select-candidates">
	<v-container fluid>

	    <div v-if="!candidatosSelecionados.length">
	    	Agora, escolha um ou mais candidatos ou partidos que tenham disputado eleições {{ uf.sigla == 'DF' ? 'no Distrito Federal': 'neste estado' }}:
	    </div>	

		<atlas-candidate-chip
			v-for="candidato in candidatosSelecionados"
			:nome="candidato.nome"
			:partido="candidato.partido"
			:cargo="candidato.cargo"
			:ano="candidato.ano"
			:color="candidato.color"
			:loading="candidato.loading"
			@remove="removeCandidate(candidato)"
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

    	candidatosSelecionados: [],

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
    			// Neste momento, temos um array de objetos
    			// Agora vamos converter esse array em um dicionário	
    			
    			console.log(data.length +  ' rows loaded by api.getVotesByZoneAndCity')
    			console.log(data[0])
/*
    			var votes = data.map((voteObj) => {
    				id: codigoMunicipio + '-' + ("00" + parseInt(codigoZona)).slice(-3),
    				numero: votos
    			})
*/    			

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
    		console.log(indexToRemove)
    		console.log('lista de candidatos:')
    		console.log(this.candidatosSelecionados)
    		if (indexToRemove >= 0) {
    			if (this.candidatosSelecionados.splice(indexToRemove, 1)) {
    				this.$emit('remove-candidate', candidato)
    			}
    			console.log('depois de remover o candidato')
    			console.log(this.candidatosSelecionados)
    		}
    		else {
    			console.error('Error trying to remove candidate from list')
    			console.log(candidato)
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
	color: #ddd;
}	

.delete-button {
	cursor: pointer;
}

.delete-button:hover {
	color: rgb(239, 83, 80);
}

</style>
