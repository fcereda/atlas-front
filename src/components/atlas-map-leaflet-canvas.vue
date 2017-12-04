<template>

    <v-container fluid fill-height pa-0>

		<div id="map" ref="map" v-bind:style="mapStyle">
		</div>

		<div class="map-controls" v-show="displayChartTypes" v-if="0">
			<div v-for="chart in chartTypes" @click="changeChartType(chart.name)" v-bind:class="chartType==chart.name?'selected-chart':''"><i class="material-icons">{{ chart.icon }}</i></div>
    	</div>	

		<div class="map-controls map-control-chart-type" v-show="displayChartTypes">
			<div 
				v-for="chart in chartTypes" 
				v-show="!mostrarIndicesIndividuais" 
				@click="changeChartType(chart.name)" 
				v-bind:class="chartType==chart.name?'selected-chart':''"
			>
				<v-icon class="pa-1" :color="chartType==chart.name?'blue lighten-2':'grey lighten-2'">{{ chart.icon }}</v-icon>
			</div>
			<div 
				v-for="chart in indexChartTypes"
				v-show="mostrarIndicesIndividuais"
				@click="changeIndexChartType(chart.name)"
				v-bind:class="indexChartType==chart.name?'selected-chart':''"
			><div class="char-icon">{{ chart.label }}</div>
			</div>	

    	</div>	

			<div class="map-controls map-control-chart-type" v-show="displayChartTypes" style="top:200px;" slot="activator">
				<div 
					v-for="layer in showDataLayers" 
					v-show="true" 
					@click="showMenu" 
					v-bind:class="chartType==layer.name?'selected-chart':''"
				>
					<v-icon class="pa-1" :color="chartType==layer.name?'blue lighten-2':'grey lighten-2'">{{ layer.icon }}</v-icon>
				</div>
			</div>	


		<v-menu 
			offset-y 
			v-model="showLayersMenu" 
			absolute 
			:position-x="layersMenuPositionX" 
			:position-y="layersMenuPositionY" 
			left
			full-width
			z-index="10000"
		>
	    <v-list dense>
	    	<v-subheader>CAMADAS DE DADOS</v-subheader>
	    	<template v-for="item in dataLayers">
		        <v-list-tile v-if="item.name" @click="">
<!--
            <v-list-tile-action>
              <v-icon v-show="item.selected">checked</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile-content>
-->

		        	<v-list-tile-title @click="showLayersMenu = false" >
		        		<span v-if="item.selected">&check;</span>
		        		<span v-if="!item.selected">&nbsp;&nbsp;&nbsp;</span>
		        		<span>&nbsp;&nbsp;{{ item.name }}</span></v-list-tile-title>

		        </v-list-tile>	
		        <v-divider v-if="!item.name"></v-divider>
	        </template>
	      </v-list>
	    </v-menu>		



<!--
    	<div class="map-controls" style="position:relative;left:12px;top:12px;width:1px">
    		<div @click="zoomIn">
    			<v-icon class="pa-1" color="grey lighten-2">zoom_in</v-icon>
			</div>
    		<div @click="zoomOut">
    			<v-icon class="pa-1" color="grey lighten-2">zoom_out</v-icon>
			</div>
    		<div @click="zoomFitBoundaries">
    			<v-icon class="pa-1 pt-4" color="grey lighten-2">zoom_out_map</v-icon>
			</div>
		</div>	
-->

	</v-container>

</template>

<script>


import Store from '../lib/store.js'
import Charts from '../lib/charts.js'
import axios from 'axios'
import chroma from 'chroma-js'

import atlasSearchMunicipalities from './atlas-search-municipalities.vue'

// Candidates and coordinates data are not included in the component's data object
//  because we don't want them to be reactive 

export default {

	components: {
		atlasSearchMunicipalities
	},

	props: [ 'uf', 'indexes' ],

	data () {

		return {

			map: null,
			mapHeight: this.calcMapHeight(),
			mouseOverChart: false,
			zonasSobMouse: [],
			geolocations: {  
				'AC': [ -9.128703100254375, -70.30709995790936 ],
				'AL': [ -9.657146073170642, -36.69477007781069 ],
				'AM': [ -3.785717917053299, -64.94955330629251 ],
				'BA': [ -13.440031328649784, -41.97912114309919 ],
				'CE': [ -5.321037629304138, -39.33830024807976 ],
				'DF': [ -15.775279397679293, -47.79695108233966 ],
				'ES': [ -19.596880738240493, -35.360203667121496 ],
				'GO': [ -15.94745743065292, -49.5788865686291 ],
				'MA': [ -5.6533656843464115, -45.2755189166553 ],
				'MT': [ -12.695298049830297, -55.929111671721685 ],
				'MS': [ -20.6176890317848, -54.54571057465736 ],
				'MG': [ -18.578043154745465, -45.45146376682702 ],
				'PR': [ -24.616884105147843, -51.77142467732972 ],
				'PB': [ -7.164432004604677, -36.77923173371886 ],
				'PA': [ -3.625075780066272, -52.479639846559735 ],
				'PE': [ -6.655754668123226, -36.87466595438816 ],
				'PI': [ -6.834035635650308, -43.18240059064856 ],
				'RJ': [ -22.066082870079953, -42.923913154537175 ],
				'RN': [ -5.907138505147245, -36.7753258619006 ], 
				'RS': [ -30.417191091665078, -53.66761188894853 ],
				'RO': [ -10.831494142732305, -63.29228963607496 ],
				'RR': [ 1.8455958047433434, -61.856057671642255 ],
				'SC': [ -27.65484096200064, -51.095990399264196 ],
				'SE': [ -10.541799765488728, -37.31946121850123 ],
				'SP': [ -22.546116618914496, -48.63612651362837 ],
				'TO': [ -9.318047360830361, -48.21937224834929 ]
			},

			stateBoundaries: {"AL":[[-10.50117582170068,-38.237589446023804],[-8.813116324640603,-35.151950709597564]],"AM":[[-9.818061377887272,-73.80156832950942],[2.2466255437806737,-56.09753828307561]],"AP":[[-1.236184960729986,-54.87624215511599],[4.436728303888998,-49.87668107315433]],"BA":[[-18.347255447192623,-46.61710686569986],[-8.532807210106945,-37.34113542049852]],"CE":[[-7.857575606490638,-41.423290748337514],[-2.7844996521176384,-37.253309747822016]],"DF":[[-16.050296450045842,-48.285523719028504],[-15.500262345312745,-47.308378445650824]],"ES":[[-21.301798586613188,-41.879623009555395],[-17.8919628898678,-38.84078432468759]],"GO":[[-19.4991647389655,-53.25081246908195],[-12.395750122340338,-45.906960668176254]],"MA":[[-10.26176381868467,-48.75513142896972],[-1.0449675500081526,-41.795906404340876]],"MG":[[-22.922736870113766,-51.046094580082936],[-14.233349439377164,-39.85683295357111]],"MS":[[-24.068597447874012,-58.16850828391636],[-17.166780615695586,-50.92291286539836]],"MT":[[-18.041580757767292,-61.63340040070763],[-7.349015341893303,-50.22482294273574]],"PA":[[-9.841163563019379,-58.8983418815875],[2.591012002886835,-46.06093781153198]],"PB":[[-8.302956077627027,-38.76558203759521],[-6.025907931582328,-34.79288142984251]],"PE":[[-9.48253335801251,-41.358358451520644],[-3.8289759782339416,-32.390973457255676]],"PI":[[-10.928761366451525,-45.99428964039032],[-2.7393099048490903,-40.370511540906804]],"PR":[[-26.717114682216902,-54.61931255227314],[-22.516653528078784,-48.0235368023863]],"RJ":[[-23.368936844438963,-44.88931172981614],[-20.76322889572094,-40.9585145792582]],"RN":[[-6.982736440457561,-38.582118948605675],[-4.831540569836928,-34.96853277519552]],"RO":[[-13.693687077566501,-66.81023839317209],[-7.969301207898109,-59.77434087897784]],"RR":[[-1.5806494677588887,-64.82524272692058],[5.2718410772455755,-58.88687261636393]],"RS":[[-33.75208127059592,-57.64376682264455],[-27.082300912734233,-49.69145695525251]],"SC":[[-29.35384668022551,-53.836873860171096],[-25.955835243775773,-48.355106938357295]],"SE":[[-11.568559213142233,-38.24503995296037],[-9.515040317835222,-36.393882484042095]],"SP":[[-25.312330120754744,-53.110110774449566],[-19.779903117074248,-44.16214225280717]],"TO":[[-13.46769931726239,-50.7420687424835],[-5.168395404398332,-45.69667575421508]]},

			brazilBoundaries: [],

			topoLayer: null,

			chartCanvas: null,
			displayChartTypes: false,
			chartTypes: [{
				name: 'winner',
				icon: 'fiber_manual_record'
			}, {
				name: 'pie',
				icon: 'pie_chart'
			}, {
				name: 'bar',
				icon: 'equalizer'
			}, {
				name: 'pill',
				icon: 'chrome_reader_mode'
			}, {
				name: 'hbar',
				icon: 'format_align_left'
			}],
			chartType: 'winner',

			indexChartTypes: [{
				name: 'indiceG',
				label: 'G'
			}, {
				name: 'indiceLQ',
				label: 'LQ'
			}],
			indexChartType: 'indiceLQ',	

			showDataLayers: [{
				name: 'on',
				icon: 'layers'
			}],
			dataLayers: [{
				name: 'IDH em 2000',
				id: 'idh2000'
			}, {
				name: 'IDH em 2010',
				id: 'idh2010',
				selected: true

			}, {
				name: 'Renda per capita 2010',
				id: 'rendaPC2010'
			}, {
				name: 'Renda per capita 2012',
				id: 'rendaPC2012'
			}, {
				name: 'Densidade demográfica',
				id: 'densidade'
			}, {
				name: null,
				id: 0,
			}, {
				name: 'Esconder camada de dados',
				id: 'nolayer'
			}],
			showLayersMenu: false,
			layersMenuPositionX: 300,
			layersMenuPositionY: 400,

			mostrarIndicesIndividuais: false
		}

	},

	computed: {

		mapStyle () {
			return 'width:100%;height:' + this.mapHeight + 'px;' + (this.mouseOverChart ? 'cursor:pointer;' : '')
		},

	},

	watch: {

		uf () {
			if (this.uf) {
				this.flyToState(this.uf.sigla)
				this.drawStateBorders()
				if (this.uf.sigla == 'SP')
					this.drawMunicipalities()
			}
			else {
				Charts.removeCharts()
				this.removeStateBorders()
				this.fitBoundsToBrazil()
			}
		},

		indexes () {
			console.log('alterou prop indexes de atlas-chart')
			console.log(this.indexes)
			if (!this.indexes) {
				Charts.setChartType(this.chartType)
				this.mostrarIndicesIndividuais = false
			}
			else {
				Charts.setChartType('index', this.indexes, this.indexChartType)
				this.mostrarIndicesIndividuais = true
			}	
    		Charts.redrawCharts()
		}

 	},


	mounted () {
		var resizeEventHandler = null
		window.addEventListener('resize', () => {
			if (!resizeEventHandler) {
				resizeEventHandler = setTimeout(() => {
					resizeEventHandler = null
					this.mapHeight = this.calcMapHeight()
				}, 50)
			}
		})

		var that = this
		var onHover = function (e) {
			// This function is an called by the Leaflet element,
			// thus the event object is a different from the regular one
			var posicoesCharts = Charts.posicoesCharts,
				chartsEncontrados = []
		    for (let i = posicoesCharts.length - 1; i >= 0; i--) {
				let thisPosicao = posicoesCharts[i].bounds,
		    		x = e.containerPoint.x, //e.offsetX, 
		    		y = e.containerPoint.y  //e.offsetY 
				if (thisPosicao[0][0] <= x &&
		    		thisPosicao[0][1] <= y &&
		    		thisPosicao[1][0] >= x &&
		    		thisPosicao[1][1] >= y) {
		  			chartsEncontrados.push(posicoesCharts[i].id)
	        	}
	    	}
	    	that.zonasSobMouse = chartsEncontrados
	    	if (chartsEncontrados.length) {
	    		//console.log('Hovering over ' + chartsEncontrados.join(', '))
	    		that.mouseOverChart = true
	    		//this.$emit('hover', chartsEncontrados)
	    	}
	    	else {
	    		that.mouseOverChart = false
	    	}	
		}
		//this.$refs.map.addEventListener('mouseover', onHover.bind(this))		
		//this.$refs.map.addEventListener('mousemove', onHover.bind(this))

		var onClick = function (e) {
			var posicoesCharts = Charts.posicoesCharts
			for (var i=0; i<posicoesCharts.length; i++)
				console.log(posicoesCharts[i].bounds[0][0], posicoesCharts[i].bounds[0][1])
			if (this.zonasSobMouse && this.zonasSobMouse.length)
				this.$emit('click', this.zonasSobMouse)
		}
		//this.$refs.map.addEventListener('click', onClick.bind(this))

		// this.onAlterouCandidatos() will be called every time a candidate 
		// is added to or removed from Store.the candidatos list
		Store.adicionarCallbackCandidatos(this.onAlterouCandidatos, this)

		this.map = L.map('map', {
			zoomDelta: 0.25,
			zoomSnap: 0.25
		})
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			maxZoom: 18,
			attribution: 'Mapa &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagens © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.streets'
		}).addTo(this.map);
		this.fitBoundsToBrazil();

		this.map.addEventListener('mouseover', onHover.bind(this))		
		this.map.addEventListener('mousemove', onHover.bind(this))
		this.map.addEventListener('click', onClick.bind(this))

		Charts.setUpCanvasLayer(this.map)

// Code by Ryan Clark (https://blog.webkid.io/maps-with-leaflet-and-topojson/)

L.TopoJSON = L.GeoJSON.extend({  
  addData: function(jsonData) {    
    if (jsonData.type === 'Topology') {
      for (var key in jsonData.objects) {
        var geojson = topojson.feature(jsonData, jsonData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }  
});

    },

	methods: {

		calcMapHeight () {
			return document.documentElement.offsetHeight
		},

		calcBrazilBoundaries () {
		    var bounds = [ [ 1000, 1000], [-1000, -1000] ]

		    for (var state in this.stateBoundaries) {
		        bounds[0][0] = Math.min(bounds[0][0], this.stateBoundaries[state][0][0])
		        bounds[0][1] = Math.min(bounds[0][1], this.stateBoundaries[state][0][1])
		        bounds[1][0] = Math.max(bounds[1][0], this.stateBoundaries[state][1][0])
		        bounds[1][1] = Math.max(bounds[1][1], this.stateBoundaries[state][1][1])
		    }

		    return bounds;

		},

		fitBoundsToBrazil () {
			this.map.fitBounds(this.calcBrazilBoundaries(), {
				paddingTopLeft: [-400, 0]
			});
		},

		flyToState (state) {
			var boundaries = this.stateBoundaries[state],
				center,
				zoom
			if (boundaries) {
				center = [ 
						(boundaries[0][0] + boundaries[1][0]) /2,
						(boundaries[0][1] + boundaries[1][1]) /2 
				]
				zoom = this.map.getBoundsZoom(boundaries)
			}
			else {
				center = this.geolocations[state]
				zoom = 7
			}					

			// Keeps zoom level up to 9; 
			// we do this because Distrito Federal is very small, so calling getBoundsZoom()
			// against its boundaries will produce too much zoom
			zoom = Math.min(zoom, 9)  
			this.map.flyTo(center, zoom)

		},	

		showMenu (e) {
			console.error('entrou em ShowMenu')
	        e.preventDefault()
	        this.showLayersMenu = false
	        this.layersMenuPositionX = e.clientX
	        this.layersMenuPositionY = e.clientY
	        console.log(this.layersMenuX, this.layersMenuY)
	        var that = this
	        this.$nextTick(() => {
	          that.showLayersMenu = true
	          console.log(this.showLayersMenu)
	        })  
		},

		drawStateBorders () {

			var that = this

			function handleLayer(layer) {
				layer.setStyle({
				    fillColor: 'rgba(255, 255, 255)',
				    fillOpacity: 0.0,
				    color: '#444',
				    weight: 2,
				    opacity: 0.4
				});

				layer.on({
					click: (e) => {
						console.log('clicou no mapa')
						console.log(that.zonasSobMouse)
						if (that.zonasSobMouse && that.zonasSobMouse.length)
							that.$emit('click', that.zonasSobMouse)
						return true
					}
				})

			}

			function addTopoData(topoData) { 
			    topoLayer.addData(topoData);
			    topoLayer.addTo(that.map);
			    topoLayer.eachLayer(handleLayer);
			}
	
			if (this.topoLayer)
				this.map.removeLayer(this.topoLayer)

			console.log('L.TopoJSON')
			console.log(L.TopoJSON)
			const topoLayer = new L.TopoJSON();
			this.topoLayer = topoLayer
			
			//var that = this  		// Hack to go around the change in context in addTopoData()
			var topoFileAddress = `/public/maps/state/${this.uf.sigla.toLowerCase()}-state.json`
			axios.get(topoFileAddress)
			.then((response) => addTopoData(response.data))
			//.catch((error) => console.error(error))

		},

		removeStateBorders () {
			if (this.topoLayer)
				this.map.removeLayer(this.topoLayer)
		},

		drawMunicipalities () {
			var topoFileAddress = '/public/maps/topojson-brasil/35.json'
			//topoFileAddress = "http://servicodados.ibge.gov.br/api/v2/malhas/35?resolucao=5"

			var that = this

			const colorScale = chroma
  				.scale(['#D5E3FF', '#003171'])
  				.domain([0,1]);

  			console.error()	

			function handleLayer(layer) {
				layer.setStyle({
				    fillColor: `rgb(${colorScale(Math.random()).rgb().join(',')})`,
				    fillOpacity: 0.3,
				    color: '#444',
				    weight: 0,
				    opacity: 0.6
				});

			}


			function addTopoData(topoData) { 
			    topoLayer.addData(topoData);
			    topoLayer.addTo(that.map);
			    topoLayer.eachLayer(handleLayer);
			}
	
			if (this.topoLayer)
				this.map.removeLayer(this.topoLayer)

			console.log('L.TopoJSON')
			console.log(L.TopoJSON)
			const topoLayer = new L.TopoJSON();
			this.topoLayer = topoLayer
			
			//var that = this  		// Hack to go around the change in context in addTopoData()
//			var topoFileAddress = `/public/maps/state/${this.uf.sigla.toLowerCase()}-state.json`
			axios.get(topoFileAddress)
			.then((response) => addTopoData(response.data))
		},

		onResize () {

		},

		onAlterouCandidatos (acao, candidato) {
			Charts.calcPlottingData()
			Charts.redrawCharts()
			this.displayChartTypes = Store.candidatos.length
		},

		changeChartType (chartType) {
    		Charts.setChartType(chartType)	
    		Charts.redrawCharts()
    		this.chartType = chartType
		},

		changeIndexChartType (indexType) {
			// this.indexes contains the candidate for who we are generating the individual index
			Charts.setChartType('index', this.indexes, indexType)
			Charts.redrawCharts()
			this.indexChartType = indexType
		}	

	}	

}

</script>

<style>

	.map-controls {
	    background-color: #424242;	
	    border: 2px solid #424242;
	    padding: 4px;
	    cursor: pointer;
	    z-index:10000;
	    color: #ddd;
	}

	.map-control-zoom {
		position: absolute;
		left: 12px;
		top: 12px;
	}

	.map-control-chart-type {
	    position: absolute;		
	    right: 12px;
	    top: 12px;
	}

	.selected-chart {
		color: #64b5f6;
	}

	.char-icon {
		width:32px;
		height:32px;
		padding-top:4px;
		padding-bottom:4px;
		text-align:center;
		font-weight:800;
		font-size:18px;
	}

	.leaflet-bar {
		border-radius: 0 !important;
	}

	.leaflet-bar a {
		border:0;
		border-radius: 0 !important;
		background-color:#424242 !important;
		color:#eee !important;
	}

.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
	 border: 0 !important;
	background-clip: padding-box;
	}

	.pointer {
		cursor: pointer;
	}

</style>	