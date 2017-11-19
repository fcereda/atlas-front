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
      ></atlas-select-candidates>

    </v-navigation-drawer>

    <v-content>

          <atlas-map 
            :uf="uf"
            style="z-index:0;"
          ></atlas-map>

          <div 
            class="ufselect elevation-2" 
            ref="ufselect"             
            v-if="!uf">
            <atlas-select-uf
              :uf="uf"
              @input="changeUf"
            ></atlas-select-uf>
          </div> 

    </v-content>
  </v-app>
</template>




<script>

  import atlasSelectCandidates from './components/atlas-select-candidates.vue'
  import atlasMap from './components/atlas-map-leaflet.vue'
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
        this.modoInicial = true
        this.uf = ''
      },

      changeUf (uf) {
        this.uf = uf
        this.modoInicial = false
      }
    }

  }
</script>

<style>

html { 
  overflow-y: hidden;
}

.cepesp-logo {
    transition: all 0.2s ease;  
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