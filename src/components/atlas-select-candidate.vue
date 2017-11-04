<template>

	<v-layout row wrap elevation-4 class="select-candidato">
	    <v-flex sm4 pa-0>
	        <v-select 
	        	v-model="ano"
	       	    v-bind:items="anos" 
	       	    single-line
	       	    hide-details 
	       	    label="Ano"
	        ></v-select>
	    </v-flex>
	    <v-flex sm8 pa-0>
	        <v-select 
	        	v-model="cargo"	
	        	v-bind:items="cargos" 
	        	hide-details 
	        	single-line
	        	label="Cargo"
	        ></v-select>
	    </v-flex>
	    <v-flex sm12 pa-0>
	       <v-select 
	       		v-bind:items="candidatos" 
	       		v-model="candidatoSelecionado"
	       		auto
	       		autocomplete
	       		hide-details
	       		single-line 
	       		item-text="nome"
	       		item-value="nome"
	       		return-object
	       		label="Candidato ou partido"
	       		nudge-bottom="20px"
	       	></v-select>
	    </v-flex>

	    <v-flex sm12 pa-0 pt-2>
	    	<div style="text-align:right;">
	    		<v-btn right 
	    		  color="primary"
	    		  :disabled="addCandidateButtonIsDisabled"
	    		  @click="addCandidate"
	    		>Adicionar candidato&nbsp;&nbsp;<v-icon>add</v-icon>
	    		</v-btn>
	    	</div>
	    </v-flex>		


    </v-layout>

</template>

<script>

export default {
	
	data: function () {

	  return {

	  	anos: [1998, 2002, 2006, 2010, 2014],
	  	cargos: ['Presidente', 'Governador', 'Senador', 'Deputado federal', 'Deputado estadual'],
	  	candidatos: [
	  		{ 
	  			nome: 'Paulo Salim Maluf',
	  			partido: 'PP',
	  			ano: 2006
	  		}, {
	  			nome: 'Paulo Silveira',
	  			partido: 'PSD',
	  			ano: 2010
	  		}, {
	  			nome: 'Paulo César Caju',
	  			partido: 'PPS',
	  			ano: 2012
	  		}, {
	  			nome: 'José Sarney',
	  			partido: 'PMDB',
	  			ano: 2012
	  		}],

	  	ano: null,
	  	cargo: null,
	  	candidatoSelecionado: null,	

	  }
	},

	computed: {

		addCandidateButtonIsDisabled () {
			return (!this.candidatoSelecionado); 
		}
	},

	methods: {

		addCandidate () {
			var { nome, partido } = this.candidatoSelecionado,
				cargo = this.cargo,
				ano = parseInt(this.ano),	
				newCandidate = {
					nome, ano, cargo, partido
				};
			this.$emit('add-candidate', newCandidate)
		}
	},

}

</script>

<style>

.select-candidato {
	padding-left: 8px;
	padding-right: 8px;
	padding-bottom: 8px;
	background-color: white;
}

</style>