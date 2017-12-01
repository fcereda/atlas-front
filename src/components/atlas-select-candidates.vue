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
			:total="candidato.total"
			:loading="candidato.loading"
			:disabled="candidato.disabled"
			:showDetails="candidato.showDetails"
			@remove="removeCandidate(candidato)"
			@disable="disableCandidate(candidato)"
			@enable="enableCandidate(candidato)"
			@open="showDetailsCandidate(candidato)"
			@close="hideDetailsCandidate(candidato)"
		></atlas-candidate-chip>	

	    <p></p>

		<atlas-select-candidate
			:uf="uf.sigla"
			@add-candidate="addCandidate">
		</atlas-select-candidate>

	</v-container>

    <v-snackbar
      :timeout="5000"
      :top="true"
      :left="true"
      color="error"
      v-model="snackbar.visible"
    >
      {{ snackbar.text }}
      <v-btn flat color="black" @click.native="snackbar.visible = false">Fechar</v-btn>
    </v-snackbar>


</div> 

</template>

<script>

import AtlasSelectCandidate from './atlas-select-candidate.vue'
import AtlasSelectUf from './atlas-select-uf.vue'
import AtlasCandidateChip from './atlas-candidate-record.vue'
import api from '../lib/api.js'
import Store from '../lib/store.js'
import Colors from '../lib/colors.js'

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
    	colorSequence: new Colors.ColorSequence('categorical'),
    	snackbar: {
    		text: 'Erro tentando carregar dados',
    		visible: false
    	}

    }),

    methods: {

    	setUF (uf) {
    		this.uf = uf
    		this.$emit('change-uf', uf.sigla)
    	},

    	addCandidate: function (candidate) {

    		var color = 'black',  
    			candidateObj = {...candidate, color, loading: true, disabled: false, showDetails: false},
    			totalVotos = {}

    		this.candidatosSelecionados.push(candidateObj)
    		api.getTotalVotesByZoneAndCity({...candidate, uf: this.uf.sigla})
    		.then((data) => {
    			//console.log('** CARREGAMOS VOTOS TOTAIS POR ZONA E MUNICIPIO!')
    			//console.log(`${data.length} rows carregados`)
    			data.forEach(({codigoMunicipio, codigoZona, votos}) => {
    				var id = Store.calcCoordenadaId(codigoMunicipio, codigoZona)
    				console.log(id + ': ' + votos)
    				totalVotos[id] = votos
				})    				
				// Somente carregamos os votos do candidato quando tivermos os votos totais das zonas
				return api.getVotesByZoneAndCity({...candidate, uf: this.uf.sigla})
			})    		
    		.then((data) => {
    			// Neste momento, temos um array de objetos
    			// Agora vamos converter esse array em um dicionário	
    			
    			//console.log(data.length +  ' rows loaded by api.getVotesByZoneAndCity')
    			//console.log(data[0])

    			//console.log('carregou totalVotos')	
    			//console.log(totalVotos)
    			var votes = {},
    				total = 0
    			data.forEach(({ codigoMunicipio, codigoZona, votos }) => {
    				var id = Store.calcCoordenadaId(codigoMunicipio, codigoZona)
    				votes[id] = {
    					id,
    					numero: votos,
    					total: totalVotos[id]
    				}
    				total += votos	
    				if (!totalVotos[id]) {
    					console.error('No voting total for local ' + id)
    				}
    			})
   			
    			candidateObj.loading = false
    			candidateObj.color = this.colorSequence.getNextColor()
    			candidateObj.total = total
    			this.$emit('add-candidate', {...candidateObj, votos: votes})
    		})
    		.catch((error) => {
    			console.error(`Error trying to load candidate data`)
    			console.error(error)
    			this.snackbar.visible = true
    			this.removeCandidate(candidateObj)
    		})

    	},

    	removeCandidate (candidato) {
    		var indexToRemove = this.candidatosSelecionados.indexOf(candidato);
    		if (indexToRemove >= 0) {
    			if (this.candidatosSelecionados.splice(indexToRemove, 1)) {
    				this.colorSequence.returnColor(candidato.color)
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
    	},

    	disableCandidate (candidato) {
    		console.log('disabling candidate')
    		console.log(candidato)
    		Store.desabilitarCandidato(candidato)
    		candidato.disabled = true
    	},

    	enableCandidate (candidato) {
    		Store.habilitarCandidato(candidato)
    		candidato.disabled = false
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
