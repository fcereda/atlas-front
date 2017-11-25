<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      dark
      permanent
      clipped
      fixed
      v-model="drawer"
      width="440"
      app
    >

      <div class="cepesp-logo" v-bind:class="classLogo">
        <span>CEPESP&nbsp;</span>
        <span style="font-weight:100">Atlas&nbsp;Eleitoral</span>
        <span v-if="!modoInicial" style="flex:1"></span>
        <span v-if="!modoInicial">
            <v-tooltip bottom open-delay="200" >
              <v-btn flat icon color="blue-grey lighten-4" class="button-logo-pequeno" slot="activator" @click="goHome">
                <v-icon>home</v-icon>
              </v-btn>
              <span>Voltar à tela inicial</span>
            </v-tooltip>  
            <v-tooltip bottom open-delay="200" z-index="10000">
              <v-btn flat icon color="blue-grey lighten-4" class="button-logo-pequeno" slot="activator">
                <v-icon>save</v-icon>
              </v-btn>
              <span>Salvar o mapa atual</span>
            </v-tooltip>  
        </span>    
      </div>

      <div v-if="modoInicial">
        <atlas-select-uf
          :uf="uf"
          @input="changeUf"
        ></atlas-select-uf>
      </div>            

      <div v-if="!modoInicial">
        <atlas-display-uf
          :uf="uf"
        ></atlas-display-uf> 
      </div>  

      <atlas-select-candidates
        v-if="!modoInicial"
        :uf="uf"
        @add-candidate="addCandidate"
        @remove-candidate="removeCandidate"
      ></atlas-select-candidates>

    </v-navigation-drawer>

    <v-content>

          <atlas-map 
            :uf="uf"
            style="z-index:0;"
          ></atlas-map>

    </v-content>

    <v-snackbar
      :timeout="5000"
      :color="'error'"
      v-model="snackbar.visible"
      style="z-index:10000;"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.visible = false">Fechar</v-btn>
    </v-snackbar>
  </v-app>
</template>




<script>

  import Store from './lib/store.js'
  import api from './lib/api.js'
  import atlasSelectCandidates from './components/atlas-select-candidates.vue'
  import atlasMap from './components/atlas-map-leaflet-canvas.vue'
  import atlasSelectUf from './components/atlas-select-uf.vue'
  import atlasDisplayUf from './components/atlas-display-uf.vue'

  export default {

    components: {
      'atlas-select-candidates': atlasSelectCandidates,
      'atlas-map': atlasMap,
      'atlas-select-uf': atlasSelectUf,
      'atlas-display-uf': atlasDisplayUf
    },

    data: () => ({
      drawer: true,
      modoInicial: true,
      uf: '',
//      locationCoords: null,
      candidates: [],
      snackbar: {
        text: 'Erro tentando carregar coordenadas geográficas',
        visible: false
      }
    }),

    props: {
      source: String
    },

    computed: {
      classLogo () {
        return this.modoInicial ? 'cepesp-logo-grande' : 'cepesp-logo-pequeno'
      }
    },

    methods: {
      goHome () {
        console.log('Go Home')          
        Store.removerTodosCandidatos()
        this.modoInicial = true
        this.uf = ''
      },

      changeUf (uf) {
        console.log(uf)
        api.getZoneAndCityLocations(uf.sigla.toLowerCase())
        .then((data) => {
          Store.coordenadas = data
        })
        .catch((error) => {
          this.snackbar.visible = true
        })
        this.uf = uf
        this.modoInicial = false
      },

      addCandidate (candidate) {
        console.log('*** Added a new candidate to the watch list')
        console.log(candidate)
        if (this.candidates.indexOf(candidate) >= 0) {
          console.log('Candidato já fazia parte da lista')
          return;
        }
        Store.adicionarCandidato(candidate)
        this.candidates.push(candidate)
      },

      removeCandidate (candidate) {
        console.log('Removendo o seguinte candidate:')
        console.log(candidate)
        Store.removerCandidato(candidate)  
      },

    }  

  }
</script>

<style>

html { 
  overflow-y: hidden;
}

.cepesp-logo {
    transition: all 0.4s ease;  
    font-weight:700;
    padding:16px;
    color:#eee;
    display:flex;
}

.cepesp-logo-grande {
    font-size:48px;
    line-height:1.0;
    padding-top:180px;
    flex-direction:column;
}

.cepesp-logo-pequeno {
    font-size:22px;
    padding-top:12px;
}

.button-logo-pequeno {
    margin:0;
    margin-top:-4px;
}

.atlas-toolbar {
  border-bottom: 1px solid #ddd !important;
}

.ufselect {
  position: fixed;
  top: 80px;
  right: 20px;
  //height: 60px;
  padding-bottom:-5px;
  width: 380px;
  z-index:2000;
  background-color: white;
  border: 1px solid #888;
}

</style>