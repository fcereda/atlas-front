import Store from  './store.js'


var angles = (new Array(101)).fill(1).map((ignore, index) => Math.PI * 2 / 100 * index),
    leafletMap,
    chartCanvas,
    plottingData = [],
    posicoesCharts = []

export default {
        
    calcPlottingData () {
        var candidatos = Store.candidatos,
            coordenadas = Store.coordenadas;

        if (!coordenadas) {
            console.error('array coordenadas não contém nenhum dado')
            return    
        }
         
        plottingData = coordenadas.map(({id, lat, long}) => {
            //console.log('este é o id da nossa coordenada', id)    

            // A base de dados só contém os locais onde o candidato obteve pelo menos um voto,
            // por isso precisamos primeiro checar se o local existe no object candidato.votos 
            var votos = candidatos.map((candidato) => candidato.votos[id] ? candidato.votos[id].numero : 0),
                totalVotos = votos.reduce((total, numero) => total + numero, 0),
                proporcoes = votos.map((numero) => numero / totalVotos),
                porcentagens = proporcoes.map((proporcao) => Math.round(proporcao * 100)),
                maisVotado = votos.reduce((maisVotado, numero, indice, votos) => maisVotado < 0 ? indice : votos[maisVotado] > numero ? maisVotado : indice, -1),
                auxPosicao = 0,
                posicoes = [0, ...porcentagens.map((porcentagem) => {
                    auxPosicao += porcentagem
                    return auxPosicao
                }) ],
                angulos = posicoes.map((posicao) => angles[posicao])

            return {
                id,
                lat,
                long,
                votos,
                totalVotos,
                proporcoes,
                porcentagens,
                maisVotado,
                posicoes,
                angulos
            }
        })
        return plottingData
    },

/*
    for (var i=0; i<data.length; i++) {
        data[i].stops = [0];
            data[i].votes = [10, 15, 25, 10].map((weight) => Math.floor(Math.random() * 1000 * weight))
        data[i].totalVotes = data[i].votes.reduce((total, number) => total + number, 0)
        if (i==10) console.log('totalVotes = ', data[i].totalVotes)
        // var notches = [0, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(100.0)].sort(function(a, b){return a-b});    
        data[i].percentages = data[i].votes.map((votes) => votes / data[i].totalVotes)
        if (i==10) console.log('percentages = ', data[i].percentages)   
        var notches = [0]
        var lastPercentage = 0
        data[i].percentages.forEach((percentage) => {
        lastPercentage += percentage
        notches.push(Math.round(lastPercentage * 100))
        })
        //notches.push(100) 
        data[i].winner = data[i].votes.reduce((winner, votes, index, arr) => winner < 0 ? index : arr[winner] < votes ? index : winner, -1) 
        
        data[i].stops = notches.map((notch) => angles[notch])
        data[i].anglesForCircleChart = data[i].votes.map((numVotes) => angles[Math.round(numVotes / data[i].votes[data[i].winner] * 100)])


        numOrderedVotes = 2 
        data[i].orderedVotes = data[i].votes.map((numVotes, index) => { 
        return {
          votes: numVotes,
          indexCandidato: index
        }
        }).sort((a, b) => b.votes - a.votes).slice(0, numOrderedVotes)
        var totalOrderedVotes = data[i].orderedVotes.reduce((total, {votes}) => total + votes, 0)
        for (var j=0, accumulatedPercentage=0; j<data[i].orderedVotes.length; j++) {
            let voteObj = data[i].orderedVotes[j],
            percentage = voteObj.votes / totalOrderedVotes
        accumulatedPercentage += percentage
        data[i].orderedVotes[j] = {...data[i].orderedVotes[j], 
          percentage, 
          accumulatedPercentage, 
          notch: Math.round(accumulatedPercentage * 100)
        }
        }   


*/


    drawChartFactory (chartType) {
        var colorSequence = ["229,57,53", "30,136,229", "251,140,0", "94,53,177", "3,155,229", "0,172,193", "255,179,0", "142,36,170", "57,73,171", "216,27,96", "192,202,51", "0,137,123", "253,216,53"],
              colors = colorSequence.map((color) => 'rgba(' + color + ',0.8)'),
              radius = 20,
              lineWidth = 4,
              drawFunction = null;

        var drawPieChart = function (ctx, dot, d, index) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);       
            ctx.arc(dot.x, dot.y, radius, d.stops[index], d.stops[index+1]);                
            ctx.fillStyle = colors[index];
            ctx.fill();
            ctx.closePath();
        }

        var drawDonutChart = function (ctx, dot, d, index) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius * 3/ 4, d.stops[index], d.stops[index+1]);         
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = radius / 2
            ctx.stroke();
            ctx.closePath();
        }
        
        var drawCircleChart = function (ctx, dot, d, index) {
            var thisRadius = radius + index * lineWidth,
                angle = d.anglesForCircleChart[index]       
            ctx.beginPath()
            ctx.moveTo(dot.x + thisRadius, dot.y)
            ctx.arc(dot.x, dot.y, thisRadius, 0, angle)
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = lineWidth
            ctx.stroke()    
            ctx.closePath()
        }

        var drawWinnerChart = function (ctx, dot, d, index) {
            if (index == d.winner) {
                ctx.beginPath()
                ctx.moveTo(dot.x, dot.y)
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
                ctx.fillStyle = colors[index]
                ctx.fill()
                ctx.closePath()
            }
        }

        var drawBarChart = function (ctx, dot, d, index) {
            let angle = d.anglesForCircleChart[index],
                percentage = d.percentages[index],
                thisRadius = radius + index * 2,
                barWidth = radius * 2 / d.percentages.length

            ctx.beginPath()
            ctx.moveTo(dot.x - radius + index*barWidth, dot.y + radius)
            ctx.lineTo(dot.x - radius + index*barWidth, dot.y + radius - radius * 2 * percentage)
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = barWidth
            ctx.stroke()
            ctx.closePath()   
        }

        const functionsByChartType = {
            'bar'   : drawBarChart,
            'circle': drawCircleChart,
            'donut' : drawDonutChart,
            'pie'   : drawPieChart,
            'winner': drawWinnerChart,
        }       

        function drawChart (canvasOverlay, params) {
            var ctx = params.canvas.getContext('2d')

            radius = Math.pow(2, leafletMap.getZoom() / 3)
            lineWidth = radius / 4
     
            ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
            console.log(plottingData.length + ' points');
            posicoesCharts = []
            for (var i = 0; i < plottingData.length; i++) {
                var d = plottingData[i];

                console.log('*** plottingData[' + i + ']')
                //console.log(d)
            
                if (params.bounds.contains([d.lat, d.long])) {    
                    console.log("passou pelo if")
                    let dot = canvasOverlay._map.latLngToContainerPoint([d.lat, d.long]); 
                    console.log('dot = ', dot)
                    for (var j = 0; j < d.votes.length; j++) {
                        drawFunction(ctx, dot, d, j)
                    }
                    posicoesCharts.push({ 
                        index: i,
                        bounds: [
                          [dot.x - radius, dot.y - radius],
                          [dot.x + radius, dot.y + radius]
                        ]
                    })                      
                }
            }    
        }   

        drawFunction = functionsByChartType[chartType]
        if (drawFunction) {
            console.log('returning a function')
            console.log(drawFunction)
            return drawChart
        }   
        return null 
    },

    setUpCanvasLayer (map) {
        leafletMap = map
        chartCanvas = L.canvasOverlay(this.drawChartFactory('pie'))
            //.drawing(Charts.drawChartFactory('pie'))
        chartCanvas.addTo(map)
    },

    redrawCharts () {
        console.log('*** chartCanvas ***')
        console.log(chartCanvas)
        chartCanvas.drawing(this.drawChartFactory('donut'))
        leafletMap.removeLayer(chartCanvas)
        chartCanvas.addTo(leafletMap)
    },

    removeCharts () {
        leafletMap.removeLayer(chartCanvas)
        chartCanvas = null
    }

}