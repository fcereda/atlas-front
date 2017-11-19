<template>

	<div class="uf-display">
		<span style="flex:1">
			{{ uf.nome }}
		</span>
			<v-menu offset-y z-index="10000">
	            <v-tooltip bottom open-delay="200" slot="activator" >
	              <v-btn flat icon color="blue-grey lighten-4" class="button-logo-pequeno" slot="activator">
	                <v-icon>format_color_fill</v-icon>
	              </v-btn>
	              <span>Esquema de cores</span>
	            </v-tooltip>  
	            <v-list>
	            	<v-subheader v-text="'Escalas'"></v-subheader>
				    <template v-for="item in menuItems">
				    	<v-list-tile v-if="item.title || item.colors" :key="item.title" @click="">
	          				<v-list-tile-title v-if="item.title">{{ item.title }}</v-list-tile-title>
	          				<template v-for="color in item.colors">
	          					<v-icon :color="color">save</v-icon>
	          				</template>	
	          			</v-list-tile>	
	          			<v-divider v-else-if="item.divider"></v-divider>
	        		</template>
	      		</v-list>
    		</v-menu>
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

		return { 

			menuItems: [{ 
				title: 'Escala colorida 1'
			}, {
				title: 'Escala colorida 2'
			}, {
				colors: [ 'red lighten-2', 'red lighten-4', 'red darken 1']
			}, {
				divider: true
			}, {
				title: 'Escala tons de azul'
			}, {
				title: 'Escala tons de verde'
			}, {
				title: 'Escala tons de vermelho' 
			}]

		}

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