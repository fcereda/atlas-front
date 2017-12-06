<template>
  <v-layout row justify-center style="z-index:10000;">
    <v-dialog v-model="show" max-width="700px"  z-index="10000" @input="onInput">
      <v-card>
        <v-card-title>
          <span class="headline">Busca avançada de candidatos</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md3>
                <v-select 
                  label="Ano"
                  v-model="anoSelecionado" 
                  v-bind:items="anos" 
                  clearable
                  hide-details 
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select 
                  label="Cargo"
                  v-model="cargoSelecionado" 
                  v-bind:items="cargos" 
                  item-text="name"
                  item-value="id"
                  clearable
                  hide-details 
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md3>
                  <v-select
                      label="Partido"
                      v-bind:items="partidos"
                      v-model="partidoSelecionado"
                      max-height="400"
                      hint="Múltiplas escolhas"
                      autocomplete
                      clearable
                      @keydown.native="selectOnKey"
                      @keyup.native="selectOnKey"
                      @keypress.native="selectOnKey"
                  ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Nome" v-model="nomeSelecionado" required hint="Basta digitar parte do nome"></v-text-field>
              </v-flex>
<!--
              <v-flex xs12 sm6 md6>
                <v-text-field label="Limitar aos votados em" hint="Escolha um município"></v-text-field>
              </v-flex>
-->              
              <v-flex xs12>

  <v-data-table
      v-bind:headers="headersCandidatos"
      :items="candidatosEncontrados"
      v-model="candidatosSelecionados"
      item-key="id"
      no-data-text="Nenhum candidato encontrado"
      select-all      
      class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="pl-1 pr-1">
        <v-checkbox
          primary
          hide-details
          v-model="props.selected"
        >
        </v-checkbox>
      </td>
      <td class="pl-0 text-xs-left">{{ props.item.nome }} ({{ props.item.partido }})</td>
      <td class="text-xs-right">{{ props.item.ano }}</td>
      <td class="text-xs-right">{{ props.item.nomeCargo }}</td>
      <td class="text-xs-right">{{ props.item.votacaoFormatada }}</td>
    </template>
  </v-data-table>


              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>

          <v-btn color="orange darken-2" flat :disabled="!candidatosSelecionados.length" @click.native="adicionarCandidatosSelecionados">
            {{ candidatosSelecionados.length > 0 ? (`Adicionar candidato${ candidatosSelecionados.length > 1 ? 's selecionados' : ' selecionado' }` ) : 'Selecione os candidatos que deseja adicionar' }}</v-btn>
          <v-spacer></v-spacer>
          
          <v-btn color="blue darken-1" flat @click.native="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" flat @click.native="procurarCandidatos">Procurar</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import axios from 'axios'
import Utils from '../lib/utils.js'


export default {
    props: ['show', 'uf'],

    data () {
      return {
        dialog: false,
        ordenarPorVotacao: false,

        anos: [1998, 2002, 2006, 2010, 2014],
        anoSelecionado: null,

        cargos: Utils.obterCargos(),
        cargoSelecionado: null,

        partidos: [ 'PMDB', 'PT', 'PSDB', 'PP', 'PSD', 'PPB', 'DEM', 'PFL', 'Rede', 'Patriotas'],
        partidoSelecionado: null,

        nomeSelecionado: null,

        headersCandidatos: [
          {
            text: 'Nome e partido',
            align: 'left',
            sortable: true,
            value: 'nome'
          },
          { text: 'Ano', value: 'ano' },
          { text: 'Cargo', value: 'cargo' },
          { text: 'Votação', value: 'votacao', align:'right' }
        ],
        candidatosEncontrados: [],
        candidatosSelecionados: [],

        procurandoCandidatos: false,
      }
    },

    watch: {
      show () {
        this.dialog = true
      }
    },

    methods: {
      closeDialog () {
        this.$emit('close')
      },

      onInput (e) {
        if (!e)
          this.closeDialog()
      },

      selectOnKey (e) {
          console.log('entrou em selectOnKey')
          if (e.key == 'Enter') {
              console.log('tecla é enter')
              console.log(e)
              e.cancelBubble = true
              e.preventDefault()
              e.stopPropagation()
              return false
          }  
      },

      procurarCandidatos () {

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
        
        this.procurandoCandidatos = true
        axios.get('/api/candidatos', { params: {
          uf: this.uf.sigla,
          ano: this.anoSelecionado,
          cargo: this.cargoSelecionado,
          nome: this.nomeSelecionado,
          partido: this.partidoSelecionado
        }})
        .then(function (response) {
            var candidatos = response.data
            candidatos.forEach((candidato) => {
              candidato.nome = Utils.capitalizeName(candidato.nome)
              candidato.displayName = candidato.nome + ' (' + candidato.partido + ')'
              candidato.nomeCargo = Utils.obterNomeCargo(candidato.cargo)
              candidato.votacaoFormatada = Utils.formatInt(candidato.votacao)
            })
            this.candidatosEncontrados = orderCandidatesByRelevance(candidatos, this.nomeSelecionado)
            this.procurandoCandidatos = false
        }.bind(this))
        .catch(function (error) {
            console.log(error)
            this.procurandoCandidatos = false
        }.bind(this))
      
      },

      adicionarCandidatosSelecionados () {
        this.$emit('add-candidates', this.candidatosSelecionados)
        this.candidatosSelecionados = []
        this.closeDialog()
      }

    }

}

</script>