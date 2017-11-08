<template>

		<v-layout row>
			<v-flex sm12>


            <v-select
              v-bind:items="ufs"
              item-value="sigla"
              item-text="nome"
              v-model="uf"
              label="Selecione uma UF para comećar..."
              return-object
              single-line
              hide-details
              autocomplete
              editable
              @input="setUf"
            ></v-select>


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


    </v-flex></v-layout>

	
	       

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
    			sigla: 'AM',
    			nome: 'Amazonas'
    		}, {
    			sigla: 'AP',
    			nome: 'Amapá'
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
    			sigla: 'MG',
    			nome: 'Minas Gerais'
    		}, {
    			sigla: 'MS',
    			nome: 'Mato Grosso do Sul'
    		}, {
    			sigla: 'MT',
    			nome: 'Mato Grosso'
    		}, {
    			sigla: 'PA',
    			nome: 'Pará'
    		}, {
    			sigla: 'PB',
    			nome: 'Paraíba'
    		}, {
    			sigla: 'PE',
    			nome: 'Pernambuco'
    		}, {
    			sigla: 'PI',
    			nome: 'Piauí'
    		}, {
    			sigla: 'PR',
    			nome: 'Paraná'
    		}, {
    			sigla: 'RJ',
    			nome: 'Rio de Janeiro'
    		}, {
    			sigla: 'RN',
    			nome: 'Rio Grande do Norte'
    		}, {
    			sigla: 'RO',
    			nome: 'Rondônia'
    		}, {
    			sigla: 'RR',
    			nome: 'Roraima'
    		}, {
    			sigla: 'RS',
    			nome: 'Rio Grande do Sul'
    		}, {
    			sigla: 'SC',
    			nome: 'Santa Catarina'
    		}, {
    			sigla: 'SE',
    			nome: 'Sergipe'
    		}, {
    			sigla: 'SP',
    			nome: 'São Paulo'
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
			console.log('changing uf to ' + uf.sigla)
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