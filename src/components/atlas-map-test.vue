<template>

    <v-container fluid fill-height pa-0>

		<svg width="100%" height="100%" style="background-color:#e0e0f0">
		</svg>

		<atlas-detail-point 
			:visible="detail.visible"
			:left="detail.left"
			:top="detail.top"
			:data="detail.data"
			@close="detail.visible=false"
		></atlas-detail-point>

	</v-container>

</template>

<script>

import AtlasDetailPoint from './atlas-detail-point.vue'


// I tried keeping the svg variable in the data object, but
// Vue seems to mess with it, rendering it unusable
var svg = null;  

export default {

	components: {
		AtlasDetailPoint
	},

	data () {

		var m = 2,
			r = 10,
	   		z = d3.scale.category20(),
	   		colors = [];

		for (var i=0; i<100; i++)
			colors.push(z(i));


		return {

			m,
			r,
			z,
			colors,

			data: [
			  [11975,  5871, 8916, 2868],
			  [ 1951, 10048, 2060, 6171],
			  [ 8010, 16145, 8090, 8045],
			  [ 1013,   990,  940, 6907],
			  [ 100, 100, 100, 100, 100, 100, 100, 100 , 100, 100  ]
			],

			positions: [
			  { x: 20, y: 20 },
			  { x: 200, y: 200 }, 
			  { x: 100, y: 400 },
			  { x: 650, y: 10 },
			  { x: 650, y: 650 }
			],

			detail: {
				visible: false,
				left: 0,
				top: 0,
				data: []
			}

		}

	},

	mounted () {

		svg = d3.select("svg").selectAll("g")
		    .data(this.data)
		    .enter().append("g")
		    .attr("class", (data, index) => "piechart" + index)
		    .attr("px", (data, index) => this.positions[index].x)
		    .attr("py", (data, index) => this.positions[index].y)
		    .attr("transform", (data, index) => this.getTranslate(index))
		    .on('click', (data, index) => {
				var pie = d3.select(".piechart" + index);
		    	this.$set(this.detail, 'visible', true);
		    	this.$set(this.detail, 'left', pie.attr('px'))
		    	this.$set(this.detail, 'top', pie.attr('py'))
		    })
		    .on('mouseover', (data, index) => {
				var pie = d3.select(".piechart" + index);
				var transform = "translate(" + pie.attr("px")/3 + "," + pie.attr("py")/3 + ")"
				pie.attr("transform", "scale(3) " + transform);
		    })
		    .on('mouseout', (data, index) => {
		        var pie = d3.select(".piechart" + index);
				var transform = "translate(" + pie.attr("px") + "," + pie.attr("py") + ")"		
				pie.attr("transform", transform);
		    });	

		this.plotData();    

	},


	methods: {

		getTranslate (index) {
	        var {x, y} = this.positions[index];
	        return "translate(" + (x) + "," + (y) + ")";
		},

		plotData () {
			// The data for each svg element is a row of numbers (an array). We pass that to
			// d3.layout.pie to compute the angles for each arc. These start and end angles
			// are passed to d3.svg.arc to draw arcs! Note that the arc radius is specified
			// on the arc, not the layout.
			svg.selectAll("path")
				.data(d3.layout.pie())
				.enter().append("path")
				.attr("d", d3.svg.arc()
				.innerRadius(this.r / 4)
				.outerRadius(this.r))
				.style("fill", (d, i) => this.colors[i] );
		},

		addNewData () {
		    for (var i=0; i<this.data.length; i++) {
		        this.data[i].push(Math.random()*2000);
		    }
		    this.plotData();
		}


	}
}

</script>

<style>

</style>	