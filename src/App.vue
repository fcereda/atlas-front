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
      <atlas-select-candidates>
      </atlas-select-candidates>
    </v-navigation-drawer>

    <v-toolbar color="primary" dark fixed app>
      <v-toolbar-title>CEPESP Atlas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>

    <main>
      <v-content>
          <atlas-map></atlas-map>
      </v-content>
    </main>

  </v-app>
</template>

<script>

  import atlasSelectCandidates from './components/atlas-select-candidates.vue'
  import atlasMap from './components/atlas-map-test.vue'

  export default {

    components: {
      'atlas-select-candidates': atlasSelectCandidates,
      'atlas-map': atlasMap
    },

    data: () => ({
      drawer: true
    }),

    props: {
      source: String
    }

  }
</script>

<style>

html { 
  overflow-y: hidden;
}

</style>