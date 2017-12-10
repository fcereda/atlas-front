colorCircle = [
[	
	[254, 241, 101],	// yellow
	[241, 199, 91],
	[225, 150, 83],		// light orange
	[216, 119, 76],
	[211, 90, 73],		// reddish
	[183, 91, 158],		// pink	
	[110, 76, 154],		// purple	
	[75, 106, 171],		// deep blue	
	[94, 148, 194],		// light blue	
	[115, 181, 171],	// teal	
	[113, 170, 102],	// green	
	[186, 208, 99]		// light green
],	
[
	[215, 199, 62],
	[204, 159, 56],
	[193, 107, 48],
	[189, 76, 44],
	[186, 52, 43],
	[148, 53, 119],
	[64, 47, 115],
	[46, 71, 127],
	[53, 107, 153],
	[74, 135, 130],
	[71, 119, 67],
	[139, 164, 72]
]
];
	
export default {

	ColorSequence (type = 'categorical', color) {

		const scales = {
		    hotScale: [1, 3, 5, 7, 9, 10, 0, 2, 4, 6, 8, 11],
		    tealScale: [9, 7, 5, 3, 1, 11, 8, 6, 4, 2, 0, 10],
		    usableScale: [7, 2, 10, 4, 0, 6, 1, 8, 3, 11]]
		}  


		if (type == 'categorical') {
			this.colors = hotScale.map(([red, green, blue]) => {
				return {
					rgbColor: `${red}, ${green}, ${blue}`,
					inUse: false
				}
			}		
		}

/*
		const hueSequence = [5, 4, 6, 3, 7, 2, 8, 1, 9]
		var colors = []	
		if (type == 'categorical') {
			var colorSequence = color == 'reversed' ? reversedColorSequence : mainColorSequence
			colors = []
			hueSequence.forEach((hue) => {
				colorSequence.forEach((color) => {
					colors.push(materialColors[color][hue])
				})
			})
		}
		else {
			color = color || 'blue'
			if (!materialColors[color])
				color = 'blue'

			colorPosition = mainColorSequence.indexOf(color)
			for (var i=colorPosition; i<mainColorSequence.length; i++)
				colors.push(materialColors[mainColorSequence[i]])
			for (i=0; i<colorPosition; i++)
				colors.push(materialColors[mainColorSequence[i]])
			colors = colors.join()
		}
	
		colors = colors.map((color) => {
			return {
				color,
				rgbColor: hexToRgb(color),
				inUse: false
			}
		})
*/
		this.colors = colors
		this.type = type
		this.color = color		

		this.getNextColor = function () {
			for (var i=0; i<this.colors.length; i++) {
				if (!this.colors[i].inUse) {
					this.colors[i].inUse = true
					return hexToRgb(colors[i].color)
				}
			}
		}	

		this.getLinearColorSequence = function () {
			return hexToRgb(materialColors[this.color])
		}

		this.returnColor = function (color) {
			for (var i=0; i<this.colors.length; i++) {
				if (this.colors[i].color == color || this.colors[i].rgbColor == color) {
					this.colors[i].inUse = false
					return color
				}
			}
		}

	}	


}

