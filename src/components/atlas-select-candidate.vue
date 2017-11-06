<template>

	<v-layout row wrap elevation-4 class="select-candidato">
	    <v-flex sm4 pa-0>
	        <v-select 
	        	v-model="ano"
	       	    v-bind:items="anos" 
	       	    single-line
	       	    hide-details 
	       	    label="Ano"
	       	    @input="changeYear"
	        ></v-select>
	    </v-flex>
	    <v-flex sm8 pa-0>
	        <v-select 
	        	v-model="cargo"	
	        	v-bind:items="cargos" 
	        	item-text="label"
	        	item-value="value"
	        	hide-details 
	        	single-line
	        	label="Cargo"
	        	@input="changeCargo"
	        ></v-select>
	    </v-flex>
	    <v-flex sm12 pa-0>
	       <v-select 
	       		:items="candidatos" 
	       		v-model="candidatoSelecionado"
	       		:disabled = "!ano || !cargo"
	       		auto
	       		autocomplete
	       		hide-details
	       		single-line 
	       		item-text="nome"
	       		item-value="nome"
	       		return-object
	       		label="Candidato ou partido"
	       		:loading="loadingCandidatesList"
	       		:search-input.sync="searchCandidates"
	       		nudge-bottom="20px"
	       		@input="setFocusAddCandidate"
	       	>
	       		<template slot="item" scope="candidato">
	       		{{ candidato.item.nome }} ({{ candidato.item.partido }})
	       		</template>
		       	<template slot="progress">
		       	Carregando lista de candidatos...
		       	</template>
		       	<template slot="no-data">
		       	{{ candidatoSelecionado ? 'Nenhum candidato encontrado' : 'Digite as primeiras letras do nome do candidato' }}
		       	</template>
	       	</v-select>
	    </v-flex>

	    <v-flex sm12 pa-0 pt-2>
	    	<div style="text-align:right;"
	    		<v-btn 
	    			right 
	    			ref="addCandidate"
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

import axios from 'axios'
import Utils from '../lib/utils.js'

export default {

	props: ['uf'],
	
	data: function () {

	  return {

	  	anos: [1998, 2002, 2006, 2010, 2014],

	  	cargos: [{
	  		label: 'Presidente 1o turno',
	  		value: 'pr1'
	  	}, {
	  		label: 'Presidente 2o turno',
	  		value: 'pr2'
	  	}, {
	  		label: 'Governador 1o turno',
	  		value: 'g1'
	  	}, {
	  		label: 'Governador 2o turno',
	  		value: 'g2'
	  	}, {
	  		label: 'Senador',
	  		value: 's'
	  	}, { 
	  		label: 'Deputado federal',
	  		value: 'df'
	  	}, { 
	  		label: 'Deputado estadual',
	  		value: 'de'
	  	}],

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
	  	searchCandidates: '', 
	  	loadingCandidatesList: false,

	  }
	},

	computed: {

		addCandidateButtonIsDisabled () {
			return (!this.candidatoSelecionado); 
		},

	},	

	watch: {	

		searchCandidates (val) {
			if (val) {
				this.queryCandidates(val)
			}	
		}
		
	},		

	methods: {

		changeYear (year) {
			if (year != this.year)
				this.candidatos = []
			this.year = year
			//this.getCandidatesList()
		},

		changeCargo (cargo) {
			if (cargo != this.cargo)
				this.candidatos = []
			this.cargo = cargo
			//this.getCandidatesList()
		},

		getCandidatesList() {
			if (!this.cargo || !this.year) {
				this.candidatos = []
				return;
			}
			this.queryCandidates()
		},

		addCandidate () {
			var { nome, partido, numero } = this.candidatoSelecionado,
				cargo = this.cargo,
				ano = parseInt(this.ano),	
				newCandidate = {
					nome: Utils.capitalizeName(nome), 
					ano, 
					cargo, 
					partido,
					numero
				}
			this.$emit('add-candidate', newCandidate)
			this.candidatoSelecionado = null
		},

		queryCandidates (val) {

			function orderCandidatesByRelevance (candidatos, nome) {

				function sortByRelevance (a, b) {
					if (a.indexNome > b.indexNome)
						return 1;
					if (a.indexNome < b.indexNome)
						return -1;
					return sortByName(a, b);
				}

				function sortByName (a, b) {
					if (a.nome > b.nome)
						return 1;
					if (a.nome < b.nome)
						return -1;
					return 0;						
				}

				if (nome) {
					nome = nome.toUpperCase();
					candidatos.forEach((candidato) => {
						candidato.indexNome = candidato.nome.toUpperCase().indexOf(nome);
					})
					return candidatos.sort(sortByRelevance)
				}	
				else {
					candidatos.forEach((candidato) => {
						candidato.indexNome = 0
					})
					return candidatos.sort(sortByName)
				}
			}
			
			this.loadingCandidatesList = true

			console.log('searching candidates ' + val)
			console.log({ params: {
				uf: this.uf,
				ano: this.ano,
				nome: val
			}});

			axios.get('/api/candidatos', { params: {
				uf: this.uf,
				ano: this.ano,
				cargo: this.cargo,
				nome: val
			}})
      		.then(function (response) {
      			console.log('Data was loaded')
    			console.log(response)
    			var candidatos = response.data
    			candidatos.forEach((candidato) => {
    				candidato.displayName = candidato.nome + ' (' + candidato.partido + ')'
    			})
    			this.candidatos = orderCandidatesByRelevance(candidatos, val)
    			this.loadingCandidatesList = false
  			}.bind(this))
  			.catch(function (error) {
    			console.log(error)
    			this.loadingCandidatesList = false
  			}.bind(this))

		},

		setFocusAddCandidate () {
			console.log('entrou em setfocuscandidate')
			this.$refs.addCandidate.$el.focus()
		},

		keypressCandidate (e) {

			console.log(e);
			e.preventDefault();

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