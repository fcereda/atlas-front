<template>

<div class="candidate-record" style="width:100%;display:flex;flex-direction:column">

	<div style="width:100%; display:flex; flex-direction:row;" @mouseover="hovering=true" @mouseout="hovering=false">
		<div class="icon-class" :style="iconStyle"><v-icon class="pt-1 pl-1 pr-1" color="grey darken-3">{{ icone }}</v-icon></div>
		<div class="candidate-title" style="width:100%; display:flex; flex-direction:row">
			<div class="candidate-name" style="width:100%;flex:1">
				<v-tooltip bottom>
					<span slot="activator" v-html="titulo"></span>
					<span v-html="titulo"></span>
				</v-tooltip>	
			</div>
			<v-tooltip bottom class="z-index-top">
				<span v-if="hovering" class="pl-2 pointer" slot="activator"><v-icon color="grey lighten-1">close</v-icon></span>
				<span>Remover este candidato</span>
			</v-tooltip>	
			<v-tooltip bottom class="z-index-top">
				<span v-if="hovering" class="pl-2 pr-2 pointer" slot="activator"><v-icon color="grey lighten-1">visibility_off</v-icon></span>
				<span>Ignorar este candidato temporariamente</span>
			</v-tooltip>	
			<v-tooltip bottom class="z-index-top">
				<div class="pointer" v-if="!loading" slot="activator">
					<v-icon v-if="!showDetails" color="grey lighten-1" @click="openDetails">keyboard_arrow_up</v-icon>
					<v-icon v-if="showDetails" color="grey lighten-1" @click="closeDetails">keyboard_arrow_down</v-icon>
					</div>
				<span>Ver mais opções</span>
			</v-tooltip>	
			<span v-if="loading">&nbsp;&nbsp;<v-progress-circular size="20" indeterminate></v-progress-circular></span>
		</div>
	</div>		
	<div class="candidate-details-pane" ref="detailsPane" :style="detailsPaneStyle">
		<div class="icon-class pl-3 pr-2" :style="iconStyle"></div>
		<div class="candidate-details" style="width:100%">
			<div class="pr-2 pb-1" style="width:100%;text-align:right;">Total de votos neste estado: 12.250.000</div>
			<div class="pb-1" style="display:flex;flex-direction:row;">
				<span style="flex:1"></span>
				<v-btn color="blue-grey darken-1">Ver carreira</v-btn>
				<v-btn color="primary">Índices individuais</v-btn>				
			</div>
		</div>	
	</div>

</div>	

<!--
		<v-chip 
			:close="!loading" 
			:color="color"
			label
			text-color="white"
			@input="$emit('remove')"
			>
			<v-avatar>
				<v-icon>{{ icone }}</v-icon>
			</v-avatar>
			<span>{{ nome }} ({{ partido }}) &mdash; {{ labelCargo }} {{ ano }}</span>
			<span v-if="loading">&nbsp;&nbsp;<v-progress-circular size="20" indeterminate></v-progress-circular></span>
		</v-chip>
-->
</template>

<style>

.no-padding {
	padding: 0;
}

.candidate-record {
	width:100%;
	background-color: #484848;
	border: 1px solid #888;
	margin-top:4px;
	margin-bottom:12px;
}

.icon-class {
	width:32px;
}

.candidate-title {
	padding-top:4px;
	padding-bottom:4px;
	padding-left:8px;
	padding-right:4px;
	overflow:hidden;
}

.candidate-name {
	padding-top:1px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow:hidden;
}

.candidate-details-pane {
	width:100%;
	display:flex;
	flex-direction:row;
	overflow:hidden;
	transition: all 0.5s ease;
}

.candidate-details {
	padding:4px;
	padding-top:8px;
	padding-left:8px;
}

.z-index-top {
	z-index:10000;
}

</style>

<script>

export default {

	props: ['nome', 'partido', 'ano', 'cargo', 'color', 'tipo', 'loading', 'showDetails'],

	data () {

		return {
			hovering: false,
		}	

	},

	computed: {

		icone () {
			const ICONES = {
				'partido': 'location_city',
				'estatistica': 'insert_chart',
				'candidato': 'account_circle'
			}
			return ICONES[this.tipo || 'candidato']
		},

		iconStyle () {
			return `background-color: rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)});`
		},

		detailsPaneStyle () {
			return this.showDetails ? `height:${ this.$refs.detailsPane.scrollHeight + 2}px;` : 'height:0;' 
		},

		labelCargo () {

			const cargos = {
				'pr1': 'Presidente T1',
				'pr2': 'Presidente T2',
				'g1' : 'Governador T1',
				'g2' : 'Governador T2',
				's'  : 'Senador',
				'df' : 'D Federal',
				'de' : 'D Estadual',
				'dd' : 'D Distrital',
				'pm1': 'Prefeito T1',
				'pm2': 'Prefeito T2',
				'v'	 : 'Vereador'
			}

			return cargos[this.cargo]

		},

		titulo () {
			return `${this.nome} (${this.partido}) &mdash; ${this.labelCargo} ${this.ano}`
		}

	}, 

	watch: {

	},

	methods: {
		openDetails () {
			console.log('entrou em openDetails')
			this.$emit('open')
		},

		closeDetails () {
			this.$emit('close')
		}

	}
}		

</script>