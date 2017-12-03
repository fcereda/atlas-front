<template>

<div style="width:100%;min-height:100px;color:#ddd;">

	<div v-for="zona in zonasInfo" class="pa-4 elevation-4">

		<h6>{{ zona.municipio }} &ndash; {{ zona.zona }}&ordf; ZE</h6>

		<table>

			<tr v-for="candidato in zona.candidatos" style="padding-bottom:10px;">

				<td v-bind:style="'min-width:20px;background-color:rgb('+candidato.color+');'">
					<v-icon class="pa-1" color="grey darken-3">account_circle</v-icon>
				</td>


				<td width="100%">{{ candidato.nome}} ({{ candidato.partido}})
					<br>
					{{ candidato.cargo }} {{ candidato.ano}}
				</td>
				<td align="right" >{{ candidato.votos.numero }}&nbsp;votos</td>
				<td align="right">&nbsp;&nbsp;{{ candidato.votos.porcentagem }}%</td>

			</tr>	

		</table>


	</div>


</div>



</template>

<script>

import Store from '../lib/store.js'
import Utils from '../lib/utils.js'

export default {

	props: ['zonas'],

	data () {

		return {

			zonasInfo: this.zonas.map((idZona) => {
				return {
					id: idZona
				}
			})

		}

	},

	watch: {

		zonas () {
			var coordenadas = Store.coordenadas
			this.zonasInfo = this.zonas.map((idZona) => {
				var coordenada = coordenadas[idZona]
				return {
					id: idZona,
					municipio: coordenada.municipio,
					zona: coordenada.zona,
					candidatos: this.obterVotos(idZona)
				}
			})
		}

	},

	methods: {

		obterVotos (idZona) {
			var candidatos = Store.candidatos
			console.log(candidatos[0])
			var votos = candidatos.map(({id, nome, ano, cargo, partido, color, votos}) => {
				return {
					id,
					nome,
					ano,
					cargo,
					partido,
					color,
					votos: {
						numero: Utils.formatInt(votos[idZona].numero),
						porcentagem: Math.floor((votos[idZona].numero / votos[idZona].total) * 10000)/100
					}
				}
			})
			console.log(votos)
			return votos
		}

	}

}

</script>