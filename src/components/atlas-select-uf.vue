<template>
	<v-layout row>
		<v-flex sm12>

            <v-select
              v-bind:items="ufs"
              item-value="sigla"
              item-text="nome"
              label="Para começar, escolha um estado aqui:"
              return-object
              single-line
              hide-details
              autocomplete
              editable
              @input="setUf"
            ></v-select>

<!--
		    <v-menu offset-y class="width100" v-show="false">
		      <v-btn large block elevation-4 color="primary" slot="activator">{{ title }}</v-btn>
		      <div style="height:400px">
		      <v-list dense>
		        <v-list-tile v-for="uf in ufs" :key="uf.sigla" @click="setUF(uf)">
		          <v-list-tile-title>{{ uf.nome }}</v-list-tile-title>
		        </v-list-tile>
		      </v-list>
		      </div>
		    </v-menu>
-->

	    </v-flex>
	</v-layout>
</template>		

<script>

export default {

	props: [ 'uf' ],

	data: function () {

		return {
    		ufs: [{
    			sigla: 'AC',
    			nome: 'Acre'
    		}, {
    			sigla: 'AL',
    			nome: 'Alagoas',
    		}, {
    			sigla: 'AP',
    			nome: 'Amapá'
    		}, {
    			sigla: 'AM',
    			nome: 'Amazonas'
    		}, {
    			sigla: 'BA',
    			nome: 'Bahia'
    		}, {
    			sigla: 'CE',
    			nome: 'Ceará'
    		}, {
    			sigla: 'DF',
    			nome: 'Distrito Federal'
    		}, {
    			sigla: 'ES',
    			nome: 'Espírito Santo',
    		}, {
    			sigla: 'GO', 
    			nome: 'Goiás'
    		}, {
    			sigla: 'MA',
    			nome: 'Maranhão'
    		}, {
    			sigla: 'MT',
    			nome: 'Mato Grosso'
    		}, {
    			sigla: 'MS',
    			nome: 'Mato Grosso do Sul'
    		}, {
    			sigla: 'MG',
    			nome: 'Minas Gerais'
    		}, {
    			sigla: 'PA',
    			nome: 'Pará'
    		}, {
    			sigla: 'PB',
    			nome: 'Paraíba'
    		}, {
    			sigla: 'PR',
    			nome: 'Paraná'
    		}, {
    			sigla: 'PE',
    			nome: 'Pernambuco'
    		}, {
    			sigla: 'PI',
    			nome: 'Piauí'
    		}, {
    			sigla: 'RJ',
    			nome: 'Rio de Janeiro'
    		}, {
    			sigla: 'RN',
    			nome: 'Rio Grande do Norte'
    		}, {
    			sigla: 'RS',
    			nome: 'Rio Grande do Sul'
    		}, {    			
    			sigla: 'RO',
    			nome: 'Rondônia'
    		}, {
    			sigla: 'RR',
    			nome: 'Roraima'
    		}, {
    			sigla: 'SC',
    			nome: 'Santa Catarina'
    		}, {
    			sigla: 'SP',
    			nome: 'São Paulo'
    		}, {
    			sigla: 'SE',
    			nome: 'Sergipe'
    		}, {
    			sigla: 'TO',
    			nome: 'Tocantins'
    		}]

		}
	},

	computed: {

		title () {
			return this.uf ? 'Selecione a UF' : this.uf.nome
		}	

	},

	methods: {

		setUf (uf) {
			this.$emit('input', uf)
		}

	}
}

</script>

<style>

.width100 {
	width: 100%;
}

.select-uf {
	background-color: white;
	padding-left: 4px;
	padding-right: 4px;
	padding-bottom: 0;
}

</style>