'use strict'

import Store from  './store.js'


var radianos = (new Array(101)).fill(1).map((ignore, index) => Math.PI * 2 / 100 * index),
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
         
        plottingData = Object.entries(coordenadas).map(([id, {lat, long}]) => {
            //console.log(id + ": " + lat + ', ' + long)    

            // A base de dados só contém os locais onde o candidato obteve pelo menos um voto,
            // por isso precisamos primeiro checar se o local existe no object candidato.votos 
            var votos = candidatos.map((candidato) => candidato.votos[id] ? candidato.votos[id].numero : 0),
                totalVotos = votos.reduce((total, numero) => total + numero, 0),
                proporcoes = votos.map((numero) => numero / totalVotos),
                porcentagens = proporcoes.map((proporcao) => Math.round(proporcao * 100)),
                ranking = proporcoes.map((porcentagem, index) => ({porcentagem, index}))   // the parenthesis around the returning object are necessary!
                    .sort((a, b) => b.porcentagem - a.porcentagem)
                    .map((obj) => obj.index),  
                maisVotado = votos.reduce((maisVotado, numero, indice, votos) => maisVotado < 0 ? indice : votos[maisVotado] > numero ? maisVotado : indice, -1),
                acumulado = 0,
                porcentagensAcumuladas = [0, ...porcentagens.map((porcentagem) => {
                    acumulado += porcentagem
                    return acumulado
                }) ],
                angulosIniciais = [...porcentagensAcumuladas.slice(0, porcentagensAcumuladas.length -1).map((porcentagem) => radianos[porcentagem]), Math.PI * 2]

                //angulosFinais = porcentagensAcumuladas.slice(1, porcentagensAcumuladas.length).map((porcentagem) => radianos[porcentagem]) 

//                console.log('just checking')
//                console.log(id)
                //console.log(candidatos[0])
//                console.log(candidatos[0].votos[id])
//                console.log(candidatos)
//                console.log(votos)
                //console.log(proporcoes)
//                console.log(porcentagens)
//                console.log(ranking)
/*                console.log(porcentagensAcumuladas)
                console.log(angulosIniciais)
                console.log(angulosFinais)
*/
            return {
                id,
                lat,
                long,
                votos,
                totalVotos,
                proporcoes,
                porcentagens,
                ranking,
                maisVotado,
                porcentagensAcumuladas,
                angulosIniciais /*,
                angulosFinais */
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
            radius,  
            lineWidth,
            drawFunction = null;

        var drawPieChart = function (ctx, dot, d, index) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);       
/*
            if (d.angulosFinais[index] <= d.angulosIniciais[index]) {
                console.log('** Warning: anguloFinal <= anguloInicial')    
                console.log(Store.candidatos[index].nome)
                console.log('anguloInicial = ', d.angulosIniciais[index], ' anguloFinal = ', d.angulosFinais[index])
            }    
*/            
            ctx.arc(dot.x, dot.y, radius, d.angulosIniciais[index], d.angulosIniciais[index+1]);
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
            if (index == d.maisVotado) {
                ctx.beginPath()
                ctx.moveTo(dot.x, dot.y)
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
                ctx.fillStyle = colors[index]
                ctx.fill()
                ctx.closePath()
            }
        }

        var drawBarChart = function (ctx, dot, d, index) {
            let proporcao = d.proporcoes[index] / d.proporcoes[d.maisVotado],
                numBarras = Math.max(d.proporcoes.length, 2),
                barWidth = radius * 2 / numBarras

            ctx.beginPath()
            ctx.moveTo(dot.x - radius + index*barWidth, dot.y + radius)
            ctx.lineTo(dot.x - radius + index*barWidth, dot.y + radius - radius * 2 * proporcao)
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = barWidth
            ctx.stroke()
            ctx.closePath()   
        }

        var drawHorizontalBarChart = function (ctx, dot, d, index) {
            let porcentagem = d.porcentagens[index],
                porcentagemMaisVotado = d.porcentagens[d.maisVotado],
                barHeight = Math.min(radius * 2 / d.porcentagens.length, radius / 2),
                posicaoRanking = d.ranking.indexOf(index),
                posicaoY = -radius + posicaoRanking * barHeight
                
            ctx.beginPath()
            ctx.moveTo(dot.x - radius, dot.y + posicaoY)
            ctx.lineTo(dot.x - radius + radius * 2 * (porcentagem / porcentagemMaisVotado), dot.y + posicaoY)
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = barHeight
            ctx.stroke()
            ctx.closePath()
        }

        var drawPillChart = function (ctx, dot, d, index) {
            var posicaoNoRanking = d.ranking.indexOf(index)
            if (posicaoNoRanking >= 2)
                return    // Pill Chart only displays data for the winner and runner-up

            var left, 
                width,
                numCandidatos = d.proporcoes.length,
                total = numCandidatos > 1 ? d.proporcoes[d.ranking[0]] + d.proporcoes[d.ranking[1]] : 1.0,
                porcentagem = d.proporcoes[index] / total

            if (posicaoNoRanking) 
                // Candidate is the 2nd place; his bar will be displayed at the right
                left = -radius + (1-porcentagem) * radius * 2
            else 
                // Candidate is the winner. his bar will be displayed on the left
                left = -radius
            width = porcentagem * radius * 2

            if (porcentagem > 1) {
                console.error('percentage > 1')
                console.log(`posicaoNoRanking = ${posicaoNoRanking}` + 
                    `d.porcentagens[d.ranking[0]] = ${d.porcentagens[d.ranking[0]]}` + 
                    `d.porcentagens[d.ranking[1]] = ${d.porcentagens[d.ranking[1]]}` +
                    `total = ${total}`)
                    console.log(d.ranking)
                    console.log(d.proporcoes)
            }      

            ctx.beginPath()
            ctx.fillStyle = colors[index]   
            ctx.fillRect(dot.x + left, dot.y - radius * (3/8), width, radius * (6/8))
            ctx.closePath()                          
        }


        const functionsByChartType = {
            'bar'   : drawBarChart,
            'circle': drawCircleChart,
            'donut' : drawDonutChart,
            'pie'   : drawPieChart,
            'winner': drawWinnerChart,
            'pill'  : drawPillChart,
            'hbar'  : drawHorizontalBarChart,
        }       

        function drawChart (params) {
            var ctx = params.canvas.getContext('2d')
            radius = Math.pow(2, Math.min(params.zoom, 12) / 2.25)
            lineWidth = radius / 4
     
            ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
            console.log(plottingData.length + ' points');
            posicoesCharts = []
            for (var i = 0; i < plottingData.length; i++) {
                var d = plottingData[i];

                if (params.bounds.contains([d.lat, d.long])) {    
                    let dot = params.layer._map.latLngToContainerPoint([d.lat, d.long]); 
                    for (var j = 0; j < d.votos.length; j++) {
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
            return drawChart
        }   
        return null 
    },


    setChartType: function (chartType) {
        this.onDrawLayer = this.drawChartFactory(chartType)
    },


    setUpCanvasLayer (map) {
        leafletMap = map
        this.setChartType('winner')
        chartCanvas = L.canvasLayer()
            .delegate(this) 
            .addTo(leafletMap);
    },

    redrawCharts () {
        chartCanvas.needRedraw()
    },

    removeCharts () {
        plottingData = []
        chartCanvas.needRedraw()
    }

}