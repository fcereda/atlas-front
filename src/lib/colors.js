import chroma from 'chroma-js'

const colorCircle = [
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
]

function hexToRgb (hex) {
	var value = parseInt(hex, 16)
	return Math.floor(value / 256 / 256) + ',' + Math.floor(value / 256) % 256 + ',' + value % 256;
}

	
export default {

	ColorSequence (type = 'categorical', baseColor='usable', numColors = 10) {

		const scales = {
		    hotScale: [1, 3, 5, 7, 9, 10, 0, 2, 4, 6, 8, 11],
		    tealScale: [9, 7, 5, 3, 1, 11, 8, 6, 4, 2, 0, 10],
		    usableScale: [7, 2, 10, 4, 0, 6, 1, 8, 3, 11]
		}  


		var colors = [],
			scale = scales[baseColor + 'Scale'];

		if (type == 'categorical') {
			[0, 1].forEach((circle) => {
				scale.forEach((index) => {
					var color = colorCircle[circle][index]
					colors.push({
						rgbColor: `${color[0]}, ${color[1]}, ${color[2]}`,
						inUse: false
					})
				})
			})		
		}
		else {
			scale = chroma.scale([baseColor, 'white']).padding([0, 0.4]).colors(numColors)
			for (var i=0; i<numColors; i++) {
				var color = hexToRgb(scale[i].replace('#', '0x'))
				colors.push({
					rgbColor: color,
					inUse: false
				})
			}	
		}	

		this.colors = colors
		this.type = type
		this.baseColor = baseColor

		this.getNextColor = function () {
			for (var i=0; i<this.colors.length; i++) {
				if (!this.colors[i].inUse) {
					this.colors[i].inUse = true
					return this.colors[i].rgbColor
				}
			}
		}

		this.getColorsFromSequence = function (start = 0, size) {
			var colors = []
			size = size || this.colors.length
			for (var i = 0; i < size; i++)
				colors.push(this.colors[start+i].rgbColor)
			return colors
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

