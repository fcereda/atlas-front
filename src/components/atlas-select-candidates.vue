<template>

<div class="select-candidates">
	<v-container fluid>

		<atlas-select-uf
			:uf="uf"
			@input="setUF">
		</atlas-select-uf>
		<p></p>

		<atlas-candidate-chip
			v-for="candidato in candidatosSelecionados"
			:nome="candidato.nome"
			:partido="candidato.partido"
			:cargo="candidato.cargo"
			:ano="candidato.ano"
			:color="candidato.color"
			@remove="removeChip(candidato)"
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

	props: [],

    data: () => ({

    	uf: {
    		sigla: 'SP',
    		nome: "São Paulo"
    	},	

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

    }),

    methods: {

    	setUF (uf) {
    		console.log('setUF to ', uf)
    		this.uf = uf
    		this.$emit('change-uf', uf.sigla)
    	},

    	addCandidate (candidate) {

    		this.candidatosSelecionados.push({...candidate, color: getNextColor() })
    		console.log(candidate)
    		console.log('uf: ', this.uf)
    		api.getVotesByZoneAndCity({...candidate, uf: this.uf.sigla});

    	},

    	removeChip (candidato) {
    		var indexToRemove = this.candidatosSelecionados.indexOf(candidato);
    		if (indexToRemove >= 0)
    			this.candidatosSelecionados.splice(indexToRemove, 1)
    		else {
    			console.log('Error trying to remove candidate from list')
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
