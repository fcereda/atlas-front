<template>

		<v-chip close 
			:color="color"
			text-color="white"
			@input="$emit('remove')"
		>{{ nome }} ({{ partido }}) &mdash; {{ labelCargo }} {{ ano }}</v-chip>

</template>

<script>

export default {

	props: ['nome', 'partido', 'ano', 'cargo', 'color'],

	data () {

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

		return {

			labelCargo: cargos[this.cargo]

		}

	},

	methods: {

	}
}		

</script>