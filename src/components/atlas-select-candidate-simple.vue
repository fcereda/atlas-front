<template>

	<v-layout row wrap class="select-candidato pa-0 pt-2">

	    <v-flex sm12 pa-0>


	        <v-select 
	        	ref="selectCandidatos"
	        	:items="candidatos"
	            v-model="candidatoSelecionado"
	            label="Adicionar candidato" 
	            :editable ="false"
	            solo
	            autocomplete
	            clearable
	            :open-on-clear="true"
	            :auto="false"
	            item-value="id" 
	            item-text="nome"
	            return-object
	            :loading="loadingCandidatesList"
	            style="z-index:10000;" 
	            z-index="10000"
	            append-icon="search"

	            :cache-items="true"
	            :search-input.sync="search"
	          	:debounce-search="200"
	            class="pa-0 ma-0"
	        >
  	       		<template slot="item" scope="candidato">
	       		{{ candidato.item.nome }}&nbsp;<small>({{ candidato.item.partido }}) {{nomeCargo(candidato.item.cargo)}} {{candidato.item.ano}}</small>
	       		</template>
		       	<template slot="no-data">
		       	&nbsp;{{ candidatoSelecionado ? 'Nenhum candidato encontrado' : 'Digite parte do nome do candidato' }}
		       	</template>	       		
			</v-select>


	    </v-flex>



	    <v-flex sm12 pa-0 pt-2 style="display:flex;">
	        <span pa-0 class="pa-0" style="flex:1">
   	    		<v-btn
   	    			flat
   	    			dense
   	    			_color="grey lighten-3"
	    			@click="showBuscaAvancada = true"
	    		>Busca avançada
	    		</v-btn>	
			</span>
	    </v-flex>		

    <atlas-dialog-busca-avancada
    	:show="showBuscaAvancada"
    	:uf="uf"
    	@close="showBuscaAvancada = false"
	    @add-candidates="addMultipleCandidates"    	
    ></atlas-dialog-busca-avancada>	

    </v-layout>

</template>

<script>

import axios from 'axios'
import Utils from '../lib/utils.js'
import atlasDialogBuscaAvancada from './atlas-dialog-busca-avancada.vue'

export default {

	components: {
		atlasDialogBuscaAvancada
	},

	props: ['uf'],
	
	data: function () {

	  return {

        search: '',
        items: [],

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

	  	candidatos: [],

	  	ano: null,
	  	cargo: null,
	  	candidatoSelecionado: null,	
	  	searchCandidates: '', 
	  	loadingCandidatesList: false,

	  	showBuscaAvancada: false,

	  }
	},

	computed: {

		addCandidateButtonIsDisabled () {
			return (!this.candidatoSelecionado); 
		},

	},	

	watch: {	

        search (val) {
            val && this.querySelectionsCandidates(val)
        },

        candidatoSelecionado (val) {
        	if (this.candidatoSelecionado) {
        		this.addCandidate()
        		this.$refs.selectCandidatos.cachedItems = []
        		console.log(this.$refs.selectCandidatos.searchInput)
        	}
        }
		
	},		

	methods: {

        querySelectionsCandidates (val) {
            val = val || ''
            if (val.length < 3) {
            	this.$refs.selectCandidatos.cachedItems = []
            	this.$set(this, 'candidatos', [])
                return;
            }
            this.$refs.selectCandidatos.cacheItems = true
            this.loadingCandidatesList = true
            axios.get('/api/candidatos', { params: {
				uf: this.uf.sigla,
				nome: val
			}})
            .then((response) => {
                this.candidatos = response.data.sort((a, b) => b.votacao - a.votacao)
                this.loadingCandidatesList = false
            })
            .catch((error) => {
                console.error('error trying to fetch candidates')
                console.error(error)
                this.loadingCandidatesList = false                
            })
        },    

        nomeCargo (cargo) {
        	return Utils.obterNomeCargo(cargo)
        },

/*
		changeYear (year) {
			if (year != this.year)
				this.candidatos = []
			this.year = year
			this.getCandidatesList()
		},

		changeCargo (cargo) {
			if (cargo != this.cargo)
				this.candidatos = []
			this.cargo = cargo
			this.getCandidatesList()
		},

		getCandidatesList() {
			if (!this.cargo || !this.year) {
				this.searchCandidates = []
				return;
			}
			this.searchCandidates = this.queryCandidates()
		},
*/
		adicionarCandidato (candidato) {
			var { nome, cargo, ano, partido, numero, classificacao, votacao } = candidato,
				newCandidate = {
					nome: Utils.capitalizeName(nome), 
					ano: parseInt(ano), 
					cargo, 
					partido,
					numero,
					classificacao,
					votacao
				}
			this.$emit('add-candidate', newCandidate)
		},

		addCandidate () {
			console.log('entrou em addCandidate')
			console.log('candidatoSelecionado = ')
			console.log(this.candidatoSelecionado)
			//this.adicionarCandidato({...this.candidatoSelecionado, cargo: this.cargo, ano: this.ano})
			this.adicionarCandidato(this.candidatoSelecionado)
			this.candidatoSelecionado = null
		},

		addMultipleCandidates (candidatosSelecionados) {

			var candidatos = candidatosSelecionados.map((candidato) => {
				var { nome, cargo, ano, partido, numero, classificacao, votacao } = candidato
				return {
					nome: Utils.capitalizeName(nome), 
					ano: parseInt(ano), 
					cargo, 
					partido,
					numero,
					classificacao,
					votacao
				}
			})
			this.$emit('add-multiple-candidates', candidatos)
			console.log("CHEGOU ATÉ AQUI!!")
			return

			//candidatosSelecionados.forEach((candidato) => console.log(candidato))
			// Vamos acrescentar um de cada vez, em intervalos de 50 ms
			candidatosSelecionados.forEach((candidato, index) => {
				setTimeout(() => {
					this.adicionarCandidato(candidato)
				}, 50*index)
			})	
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
			axios.get('/api/candidatos', { params: {
				uf: this.uf.sigla,
				ano: this.ano,
				cargo: this.cargo,
				nome: val
			}})
      		.then(function (response) {
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
			this.$refs.addCandidate.$el.focus()
		},

	},

}

</script>

<style>

.select-candidato {
	padding-left: 8px;
	padding-right: 8px;
	padding-bottom: 8px;
}

</style>