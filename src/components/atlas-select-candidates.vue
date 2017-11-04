<template>

<div class="select-candidates">
	<v-container fluid>

		<atlas-select-uf>
		</atlas-select-uf>
		<p></p>

<!--
		<v-chip close 
			v-for="candidato in candidatosSelecionados"
			:v-model="candidato.show"
			:color="candidato.color"
			text-color="white"
			@input="removeChip(candidato)"
		>{{ candidato.nome }} ({{ candidato.partido }}) &mdash; {{ candidato.cargo }} {{ candidato.ano }}</v-chip>
-->

		<v-data-table
      		v-bind:headers="headersCandidatosSelecionados"
      		:items="candidatosSelecionados"
      		class="elevation-4"
    	>

		    <template slot="items" scope="candidato">

     	    	<tr class="pa-0">
     	    		<td class="pl-2 pr-2"><v-icon :color="candidato.item.color">bookmark</v-icon></td> 	
					<td class="pl-2" style="width:50%">{{ candidato.item.nome }}</td>
			        <td class="text-xs-left">{{ candidato.item.cargo }}</td>
			        <td class="pr-2 text-xs-right">{{ candidato.item.ano }}</td>
			        <td class="pl-0 pr-1"><v-icon class="delete-button" @click="deleteCandidate(candidato)">delete_forever</v-icon></td>

			    </tr>  
		    </template>
  	    </v-data-table>

	    <p></p>


		<atlas-select-candidate
			@add-candidate="addCandidate">
		</atlas-select-candidate>


	</v-container>
</div> 

</template>

<script>

import AtlasSelectCandidate from './atlas-select-candidate.vue'
import AtlasSelectUf from './atlas-select-uf.vue'

export default {

	components: {
		AtlasSelectCandidate,
		AtlasSelectUf
	},

	props: [],

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
    		color: 'orange darken-2',
    		show: true
    	}, {
    		nome: 'Gilberto Kassab',
    		partido: 'PSD',
    		cargo: 'Senador',
    		ano: 2014,
    		votos: 567099,
    		color: 'indigo',
    		show: true
    	}, {
    		nome: 'Luiza Erundina',
    		partido: 'PSB',
    		cargo: 'D Federal',
    		ano: 2010,
    		votos: 90001,
    		color: 'orange darken-4',
    		show: true
    	}, {
    		nome: 'Geraldo Alckmin',
    		partido: 'PSDB',
    		cargo: 'Governador',
    		ano: 2014,
    		votos: 35090000,
    		color: 'purple darken-3',
    		show: true
    	}],

    }),

    methods: {

    	addCandidate (candidate) {

    		this.candidatosSelecionados.push({...candidate, color:'purple darken-4'})

    	},

    	deleteCandidate (obj) {
	   		var candidateToRemove = obj.item,
    			indexToRemove = this.candidatosSelecionados.indexOf(candidateToRemove)
    		if (indexToRemove >= 0)
    			this.candidatosSelecionados.splice(indexToRemove, 1)
    		else {
    			console.error('Error trying to remove candidate from list')
    			console.log(obj)
    			console.log(this.candidatosSelecionados)		
    		}
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
	background-color: #fff;
	overflow-y: hidden;
}	

.delete-button {
	cursor: pointer;
}

.delete-button:hover {
	color: rgb(239, 83, 80);
}

</style>
