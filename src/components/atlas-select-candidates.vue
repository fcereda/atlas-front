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
			:showDetails="candidato.showDetails"
			@remove="removeCandidate(candidato)"
			@open="showDetailsCandidate(candidato)"
			@close="hideDetailsCandidate(candidato)"
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
import AtlasCandidateChip from './atlas-candidate-record.vue'
import api from '../lib/api.js'
import Store from '../lib/store.js'

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
    		this.uf = uf
    		this.$emit('change-uf', uf.sigla)
    	},

    	addCandidate: function (candidate) {

    		var color = 'black',  //'grey darken-1', //getNextColor(),
    			candidateObj = {...candidate, color, loading: true, showDetails: false}
    		this.candidatosSelecionados.push(candidateObj)
    		api.getVotesByZoneAndCity({...candidate, uf: this.uf.sigla})
    		.then((data) => {
    			// Neste momento, temos um array de objetos
    			// Agora vamos converter esse array em um dicionário	
    			
    			//console.log(data.length +  ' rows loaded by api.getVotesByZoneAndCity')
    			//console.log(data[0])

    			var votes = {}
    			data.forEach(({ codigoMunicipio, codigoZona, votos }) => {
    				var id = Store.calcCoordenadaId(codigoMunicipio, codigoZona)
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
    			if (this.candidatosSelecionados.splice(indexToRemove, 1)) {
    				this.$emit('remove-candidate', candidato)
    			}
    		}
    		else {
    			// This should never occur!	
    			console.error('Error trying to remove candidate from list')
    			console.log(candidato)
    		}
    	},

    	showDetailsCandidate (candidato) {
  			this.candidatosSelecionados.forEach ((esteCandidato) => esteCandidato.showDetails = (esteCandidato == candidato))
    	},

    	hideDetailsCandidate (candidato) {
    		candidato.showDetails = false
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
