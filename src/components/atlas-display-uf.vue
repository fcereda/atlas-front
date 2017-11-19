<template>

	<div class="uf-display">
		<span style="flex:1">
			{{ uf.nome }}
		</span>
            <v-tooltip bottom open-delay="200" >
              <v-btn flat icon color="blue-grey lighten-4" class="button-logo-pequeno" slot="activator">
                <v-icon>format_color_fill</v-icon>
              </v-btn>
              <span>Esquema de cores</span>
            </v-tooltip>  
            <v-tooltip bottom open-delay="200" z-index="10000">
              <v-btn flat icon color="blue-grey lighten-4" class="button-logo-pequeno" slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <span>Mais opções</span>
            </v-tooltip> 


	</div>

</template>

<script>

export default {

	props: [ 'uf' ],

	data () {

		return {}

	}


}


</script>

<style>

.uf-display {
	font-size: 24px;	
	width: 100%;
	color:rgba(255,255,255,0.8);
	background-color: rgba(255, 255, 255, 0.05);
	border-top: 1px solid rgba(255, 255, 255, 0.25);
	border-bottom: 1px solid rgba(255, 255, 255, 0.25);
	padding-left:20px;
	padding-right:16px;
	padding-top:4px;
	padding-bottom:4px;
	display:flex;
}

</style>