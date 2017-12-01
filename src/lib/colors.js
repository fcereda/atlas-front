const materialColors = {"red":["ffebee","ffcdd2","ef9a9a","e57373","ef5350","f44336","e53935","d32f2f","c62828","b71c1c"],"pink":["fce4ec","f8bbd0","f48fb1","f06292","ec407a","e91e63","d81b60","c2185b","ad1457","880e4f"],"purple":["f3e5f5","e1bee7","ce93d8","ba68c8","ab47bc","9c27b0","8e24aa","7b1fa2","6a1b9a","4a148c"],"deep-purple":["ede7f6","d1c4e9","b39ddb","9575cd","7e57c2","673ab7","5e35b1","512da8","4527a0","311b92"],"indigo":["e8eaf6","c5cae9","9fa8da","7986cb","5c6bc0","3f51b5","3949ab","303f9f","283593","1a237e"],"blue":["e3f2fd","bbdefb","90caf9","64b5f6","42a5f5","2196f3","1e88e5","1976d2","1565c0","0d47a1"],"light-blue":["e1f5fe","b3e5fc","81d4fa","4fc3f7","29b6f6","03a9f4","039be5","0288d1","0277bd","01579b"],"cyan":["e0f7fa","b2ebf2","80deea","4dd0e1","26c6da","00bcd4","00acc1","0097a7","00838f","006064"],"teal":["e0f2f1","b2dfdb","80cbc4","4db6ac","26a69a","009688","00897b","00796b","00695c","004d40"],"lime":["f9fbe7","f0f4c3","e6ee9c","dce775","d4e157","cddc39","c0ca33","afb42b","9e9d24","827717"],"yellow":["fffde7","fff9c4","fff59d","fff176","ffee58","ffeb3b","fdd835","fbc02d","f9a825","f57f17"],"amber":["fff8e1","ffecb3","ffe082","ffd54f","ffca28","ffc107","ffb300","ffa000","ff8f00","ff6f00"],"orange":["fff3e0","ffe0b2","ffcc80","ffb74d","ffa726","ff9800","fb8c00","f57c00","ef6c00","e65100"],"deep-orange":["fbe9e7","ffccbc","ffab91","ff8a65","ff7043","ff5722","f4511e","e64a19","d84315","bf360c"],"blue-grey":["eceff1","cfd8dc","b0bec5","90a4ae","78909c","607d8b","546e7a","455a64","37474f","263238"]}
const mainColorSequence = ['red', 'blue', 'orange', 'deep-purple', 'light-blue', 'cyan', 'amber', 'purple', 'indigo', 'pink', 'lime', 'teal', 'yellow']
const reversedColorSequence = mainColorSequence.slice().reverse()
const nextHues = [5, 9, 8, 7, 6, 4, 6, 3, 2, 5]

function hexToRgb (hex) {
	var value = parseInt(hex, 16)
	return Math.floor(value / 256 / 256) + ',' + Math.floor(value / 256) % 256 + ',' + value % 256;
}


export default {

	// constructor for a color sequence object
	// arguments:
	// - type: 'categorical' or 'linear'. Default is categorical
	// - color: for categorical sequences, may be main or reversed. For linear sequences, may be one of the materialColors 

	ColorSequence (type = 'categorical', color) {
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

		console.log('colors created by ColorSequence:')
		console.log(colors)
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