<template>
  <v-app id="inspire">
    <v-navigation-drawer
      persistent
      v-model="drawer"
      width="440"
      enable-resize-watcher
      right
      app
    >
      <atlas-select-candidates
        @change-uf="changeUf">
      </atlas-select-candidates>
    </v-navigation-drawer>

    <v-toolbar color="white" class="atlas-toolbar" fixed app>
      <v-toolbar-title>CEPESP Atlas</v-toolbar-title>

      <v-spacer></v-spacer>  
  
      <v-tooltip right>
        <v-btn color="primary" flat icon slot="activator"><v-icon>home</v-icon></v-btn>
        <span>Voltar ao comeco</span>
      </v-tooltip>

      <v-tooltip right>
        <v-btn color="primary" flat icon slot="activator"><v-icon>save</v-icon></v-btn>
        <span>Salvar esta visualizacão</span>
      </v-tooltip>
             
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>

    <main style="border-top:2px solid black;">
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
    </main>

  </v-app>
</template>

<script>

  import atlasSelectCandidates from './components/atlas-select-candidates.vue'
  import atlasMap from './components/atlas-map-leaflet.vue'
  import atlasSelectUf from './components/atlas-select-uf.vue'

  export default {

    components: {
      'atlas-select-candidates': atlasSelectCandidates,
      'atlas-map': atlasMap,
      'atlas-select-uf': atlasSelectUf
    },

    data: () => ({
      drawer: true,
      uf: '',
    }),

    props: {
      source: String
    },

    methods: {
      changeUf (uf) {
        this.uf = uf
      }
    }

  }
</script>

<style>

html { 
  overflow-y: hidden;
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